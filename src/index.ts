import Discord, { TextChannel } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import auth from './data/auth.json';
import readline from 'readline';
import manifestVersion from './data/manifest-version.json';
import * as f from './functions';
import * as eventsFile from './events'
import * as Destiny from './interfaces'
import fs from 'fs';
const mongodb = require('mongodb');
const dateFormat = require('dateformat');
const mongoClient = new mongodb.MongoClient(auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
const Client = new Discord.Client({disableMentions: "everyone", ws: {intents: Discord.Intents.ALL}, presence: {activity: {name: "you | Use ?help for help", type: "WATCHING"}, status: "online"}});
const commands: Discord.Collection<string, Command> = new Discord.Collection();
const commandGroups: any[string] = []
var permissionsList
var listeningForMessages: any[] = []
var prefixList

//#region Interfaces
interface IFunctions {
    /**
     * Gets a user's permission level and returns it in a promise.
     * @param guild The guild in which to get the member's permission level.
     * @param member The member in which to get the permission level of.
     */
    getUserLevel(guild: Discord.Guild, member: Discord.GuildMember): Promise<number>;

    /**
     * Constructs a `Discord.MessageEmbed` and returns it.
     * @param type The type of embed in which to return. Accepts `normal`, `success`, `error`, or any color.
     * @param text The text in which to set the description of the embed.
     */
    BasicEmbed(type: string, text?: any): Discord.MessageEmbed;

    /**
     * Gets a guild member based on name, nickname, or mention.
     * @param message The message which triggered the function.
     * @param str The string in which to search with.
     */
    getMember(message: Discord.Message, str: string): any[];
}

interface IAuth {
    /**
     * The bot token.
     */
    token: string;

    /**
     * The Destiny API key.
     */
    destinyAPI: string;

    /**
     * The Destiny API User Agent.
     */
    destinyUserAgent: string;

    /**
     * MongoDB login string.
     */
    dbLogin: string;
}

interface Command {
    /**
     * The command name.
     */
    name: string;

    /**
     * The command's aliases, if any.
     */
    aliases: any[string];

    /**
     * The arguments the command takes, if any.
     */
    args?: string;

    /**
     * The command's description.
     */
    desc: string;

    /**
     * The command's permission level.
     */
    level: number;

    /**
     * Whether or not the command will show up in commands like `?help`
     */
    hidden?: boolean;

    /**
     * Execute the command.
     * @param message The message that triggered the command to run.
     * @param args Associated arguments, if any.
     */
    func(message: Discord.Message, args: string[]): void;
}

declare global {
    namespace NodeJS {
        interface Global {
            Client: Discord.Client;
            Functions: IFunctions;
            Auth: IAuth;
            List: any;
            PermissionsList: any[];
            PrefixList: any[];
            CommandCount: number;
        }
    }
}
//#endregion

//Ready listener
Client.on('ready', async () => {
    console.log('Bot has connected.')
    fs.readFile('./reports.txt', 'utf8', function(_err: Error, data: string) {
        if (data == undefined) {
            return false
        }
        var reports = data.match(/New report/g).length
        if (reports == 0) {
            return false
        }
        return console.log(`----\nYou have ${reports} unresolved ${reports == 1 ? "report" : "reports"}.`)
    })
    await mongoClient.connect()
    global.PermissionsList = await mongoClient.db("Servers").collection("Permissions").find({}).toArray();
    global.PrefixList = await mongoClient.db("Servers").collection("Prefixes").find({}).toArray();
    mongoClient.close()
    axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/`, {
        headers: {
            'X-API-Key': auth.destinyAPI,
            'User-Agent': auth.destinyUserAgent
        }
    })
    .then((m: AxiosResponse<Destiny.ServerResponse<Destiny.DestinyManifest>>) => {
        if (m.data.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition != manifestVersion.version) {
            console.log("New version of the Destiny Item Manifest available, downloading it now...")
            manifestVersion.version = m.data.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
            axios.get(`https://www.bungie.net${m.data.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition}`, {
                headers: {
                    'X-API-Key': auth.destinyAPI,
                    'User-Agent': auth.destinyUserAgent
                }
            })
            .then((c: AxiosResponse) => {
                var toWrite = c.data
                fs.writeFile('../../DestinyManifest.json', JSON.stringify(toWrite), function (err) {
                    fs.unlink('./src/data/DestinyManifest.json', function (err) {
                        fs.rename('../../DestinyManifest.json', './src/data/DestinyManifest.json', function (err) {
                            console.log("Successfully downloaded new version of the manifest, restarting bot now...")
                            fs.writeFileSync('./src/data/manifest-version.json', JSON.stringify(manifestVersion, null, "\t"))
                        })
                    })
                })
            })
        }
    })
    .catch((c: Error) => {
        console.log("sus")
    })
})

//Pull events from events.js
for (var logger in eventsFile) {
    //@ts-ignore
    Client.on(logger, eventsFile[logger].bind(null, Client));
}

//Command listener
Client.on('message', async (message) => {
    if (global.List[1] != undefined && !message.guild && message.author.id == "287372868814372885") {
        (Client.guilds.cache.find(guild => guild.id === String(global.List[0])).channels.cache.find(channel => channel.id === String(global.List[1])) as TextChannel).send(message.content)
    }
    else if (message.channel.id == String(global.List[1]) && message.author.id != "660856814610677761") {
        Client.users.resolve("287372868814372885").send(`**${message.author.username}#${message.author.discriminator}:** ${message.content}`)
        message.attachments.forEach(async a => {
            Client.users.resolve("287372868814372885").send({files: [a]})
        })
    }
    if (!message.guild || message.author.bot || message.webhookID) {
        return false
    }
    const args = message.content.trim().split(" ")
    var comm = args.shift()
    var prefix = "?"
    if (global.PrefixList == undefined || global.PermissionsList == undefined) return false;
    global.PrefixList.forEach((e: any[string]) => {
        if (e["server"] == message.guild.id) {
            prefix = e["prefix"]
        }
    })
    //Help Command
    if (comm == `${prefix}help` || comm == `${prefix}commands`) {
        //Check if roles set
        var inDB = false;
        global.PermissionsList.forEach((e: any[string]) => {
            if (e["server"] == message.guild.id) {
                inDB = true;
                return;
            }
        })
        if (!inDB) {
            var setup = true
            message.channel.send("Hello!\nIt looks like I do not have administration and moderation roles setup in this server.\nPlease mention or paste the ID of a role to set **Level 1** permissions for it.")
            while (setup == true) {
                await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                    if (c.first().author.bot || c.first().system) {
                        return true
                    }
                    else if (c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                        return message.channel.send("Please mention or paste the ID of a different role.")
                    }
                    else if (c.first().mentions.roles.first() != undefined) {
                        if (c.first().mentions.roles.first().id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                            return message.channel.send("Please mention or paste the ID of a different role.")
                        }
                        var write1 = c.first().mentions.roles.first().id
                    }
                    else if (message.guild.roles.cache.find(role => role.id == c.first().content) != undefined) {
                        var write1 = c.first().content
                    }
                    else {
                        return message.channel.send("Please mention or paste the ID of a valid role.")
                    }
                    message.channel.send(`Awesome! I'll set ${message.guild.roles.cache.get(write1).name} as the role for level 1 permissions. Now we'll need a level 2 role. Please mention or paste the ID of a role to set **Level 2** permissions for it.`)
                    while (setup == true) {
                        await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                            if (setup == false) {
                                return false
                            }
                            if (c.first().author.bot || c.first().system) {
                                return true
                            }
                            else if (write1 == c.first().content || (c.first().mentions.roles.first() != undefined && write1 == c.first().mentions.roles.first().id) ||c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                return message.channel.send("Please mention or paste the ID of a different role.")
                            }
                            else if (c.first().mentions.roles.first() != undefined) {
                                if (c.first().mentions.roles.first().id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                    return message.channel.send("Please mention or paste the ID of a different role.")
                                }
                                var write2 = c.first().mentions.roles.first().id
                            }
                            else if (message.guild.roles.cache.find(role => role.id == c.first().content) != undefined) {
                                var write2 = c.first().content
                            }
                            else {
                                return message.channel.send("Please mention or paste the ID of a valid role.")
                            }
                            await mongoClient.connect()
                            await mongoClient.db("Servers").collection("Permissions").insertOne({server: message.guild.id, level1: write1, level2: write2})
                            await mongoClient.db("Servers").collection("Prefixes").insertOne({server: message.guild.id, prefix: "?"})
                            global.PrefixList = await mongoClient.db("Servers").collection("Prefixes").find({}).toArray();
                            global.PermissionsList = await mongoClient.db("Servers").collection("Permissions").find({}).toArray();
                            mongoClient.close()
                            message.channel.send("I'm all set up!\nUse `?help` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#9958.")
                            return setup = false;
                        })
                    }
                })
            }
        }
        //Help cats
        else if (args[0] == undefined || args[0] == "") {
            message.reply("check your DMs.")
            message.author.send("Please pick a category from the following (type `cancel` to cancel).", f.BasicEmbed(("normal"), commandGroups.join("\n"))).then((i) => {
                (Client.channels.resolve(i.channel.id) as TextChannel).awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 15000, errors: ['time'] }).then(async c => {
                    var category = c.first().content.toLowerCase()
                    if (category == "cancel") {
                        return message.author.send("Cancelled command.")
                    }
                    else if (category.startsWith(prefix)) {
                        var category = category.slice(1)
                    }
                    if (commandGroups[category]) {
                        const embed = f.BasicEmbed(("normal"), " ").setTitle(`Commands - ${category}`)
                        commands.forEach((commandData) => {
                            if (!commandData.hidden) {
                                embed.setDescription(embed.description + `**${prefix + commandData.name} ${commandData.args ? commandData.args : ""}** - ${commandData.desc}\n`)
                            }
                        })
                        return message.author.send(`Type \`${prefix}help\` followed by the command name for more information on a specific command.`, embed)
                    }
                    return message.author.send(f.BasicEmbed(("error"), "That category does not exist!"))
                })
                .catch(async e => {
                    return i.edit(f.BasicEmbed(("RED"), "Listening time expired."))
                })
            })
            .catch(() => {
                message.reply("there was an error sending you the help DM. Make sure you do not have the bot blocked.")
            })
        }
        //Command help
        else {
            const searchCommand = args[0]
            const commandData = commands.get(searchCommand)
            if (commandData != undefined && !commandData.hidden) {
                var levelList: any[string] = []
                global.PermissionsList.forEach((e: any[string]) => {
                    if (e["server"] == message.guild.id) {
                        levelList = e
                    }
                })
                message.reply("check your DMs.")
                return message.author.send(f.BasicEmbed("normal")
                    .setTitle(`Command Help: ${commandData.name}`)
                    .addField("Name", commandData.name, true)
                    .addField("Aliases", commandData.aliases.join(", ") || "N/A", true)
                    .addField('\u200b', '\u200b', true)
                    .addField("Arguments", commandData.args || "N/A", true)
                    .addField("Level", `${commandData.level} (${commandData.level == 3 ? "Bot Owner" : commandData.level == 0 ? "Normal User" : commandData.level == -1 ? "Bot" : message.guild.roles.resolve(levelList[`level${commandData.level}`]).name})`, true)
                    .addField("Description", commandData.desc))
                .catch(() => {
                    message.reply("there was an error sending you the help DM. Make sure you do not have the bot blocked and your DMs are open.")
                })
            }
            else if (searchCommand == "help" || searchCommand == "commands") {
                message.reply("check your DMs.")
                return message.author.send(f.BasicEmbed("normal")
                    .setTitle("Command Help: help")
                    .addField("Name", "help", true)
                    .addField("Aliases", "commands", true)
                    .addField('\u200b', '\u200b', true)
                    .addField("Arguments", "[command]", true)
                    .addField("Level", "0 (Normal User)", true)
                    .addField("Description", "Returns a list of commands from a category, or provides more information on a command."))
                .catch(() => {
                    message.reply("there was an error sending you the help DM. Make sure you do not have the bot blocked and your DMs are open.")
                })
            }
            if (commandData != undefined) {
                const embed = f.BasicEmbed("normal", " ").setTitle("Commands")
                if (!commandData.hidden) {
                    embed.setDescription(embed.description + `**${prefix + commandData.name} ${commandData.args ? commandData.args : ""}** - ${commandData.desc}\n`)
                }
                return message.channel.send(`Type \`${prefix}help\` followed by the command name for more information on a specific command.`, embed)
            }
            return message.channel.send(f.BasicEmbed("error", "Command not found."))
        }
    }
    var execCommand = commands.get(comm.slice(1))
    var inDB = false;
    global.PermissionsList.forEach((e: any[string]) => {
        if (e["server"] == message.guild.id) {
            inDB = true;
            return;
        }
    })
    if (comm.slice(0, 1) == prefix && execCommand != undefined && await f.getUserLevel(message.guild, message.member) == -1 || inDB == false) {
        return false
    }
    else if (comm.slice(0, 1) == prefix && execCommand != undefined && await f.getUserLevel(message.guild, message.member) >= execCommand.level) {
        //Executes command
        try {
            execCommand.func(message, args)
        }
        catch (e) {
            message.channel.send(f.BasicEmbed(("error"), e))
        }
    }
    else if (comm.slice(0, 1) == prefix && execCommand != undefined && await f.getUserLevel(message.guild, message.member) < execCommand.level) {
        return message.channel.send(f.BasicEmbed(("error"), "You do not have the proper permissions to execute this command."))
    }
})

//Load amount of commands
global.CommandCount = 0
fs.readdir('src/commands', (_err: Error, groups: any[string]) => {
    groups.forEach((group: string) => {
        commandGroups.push(group)
        fs.readdir(`src/commands/${group}`, (_groupErr: Error, comms: any[string]) => {
            comms.forEach((command: string) => {
                const commandData: Command = require(`./commands/${group}/${command}`)
                commands.set(commandData.name, commandData)
                global.CommandCount++
            })
        })
    })
})

//Global functions
global.Client = Client
global.Functions = f
global.Auth = auth
global.List = listeningForMessages
global.PermissionsList = permissionsList
global.PrefixList = prefixList

//Bot login
try {
    Client.login(auth.token)
}
catch (e) {
    console.error(`Failed to connect: got ${e.message}. Trying again...`);
    try {
        Client.login(auth.token);
    }
    catch (e) {
        console.error(`Failed to connect: got ${e.message}. Halting further connection attempts.\nStack trace:\n${e.stack}`);
    }
}