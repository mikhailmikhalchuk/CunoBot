import Discord, { Collection, Intents, TextChannel } from 'discord.js';
import { REST } from '@discordjs/rest';
import { APIMessage, Routes } from 'discord-api-types/v9';
import axios, { AxiosResponse } from 'axios';
import auth from './data/auth.json';
import readline from 'readline';
import manifestVersion from './data/manifest-version.json';
import * as f from './functions';
import * as eventsFile from './events'
import * as Destiny from './interfaces'
import fs from 'fs';
import { SlashCommandBuilder } from '@discordjs/builders';
const mongodb = require('mongodb');
const dateFormat = require('dateformat');
const mongoClient = new mongodb.MongoClient(auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
const Client = new Discord.Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INTEGRATIONS], presence: {status: "online", activities: [{name: "you. | Use /levels change to set perms", type: "WATCHING"}]}});
const commands: any[] = [];
const commandGroups: any[string] = []
const rest = new REST({version: '9'}).setToken(auth.token);
var permissionsList
var listeningForMessages: any[] = []
var updateComm: any[] = []

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
    getMember(guild: Discord.Guild, str: string): any[];
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
    data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;

    execute(interaction: Discord.CommandInteraction): Promise<Discord.Message | APIMessage>;
}

declare global {
    namespace NodeJS {
        interface Global {
            Client: Discord.Client;
            Functions: IFunctions;
            Auth: IAuth;
            List: string[];
            PermissionsList: any[];
            Commands: Discord.Collection<string, Command>;
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
    mongoClient.close()
    axios.get('https://www.bungie.net/Platform/Destiny2/Manifest/', {
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
    await rest.put(
        Routes.applicationGuildCommands("660856814610677761", "660857785566887976"),
        { body: updateComm}
    )
    await rest.put(
        Routes.applicationCommands("660856814610677761"),
        { body: commands}
    )
    const permissions3: Discord.ApplicationCommandPermissionData[] = [
        {
            id: '287372868814372885',
            type: 'USER',
            permission: true
        }
    ]
    
    global.PermissionsList.forEach(async (e: any[string]) => {
        const com = await Client.application.commands.fetch()
        const permissions1: Discord.ApplicationCommandPermissionData[] = [{
            id: e["level1"],
            type: 'ROLE',
            permission: true,
        }]
        const permissions2: Discord.ApplicationCommandPermissionData[] = [{
            id: e["level2"],
            type: 'ROLE',
            permission: true,
        }]
        const full: Discord.GuildApplicationCommandPermissionData[] = [
            {
                id: com.find(c => c.name === "ban").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "kick").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "mute").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "purge").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "sendas").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "log").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "getmessage").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "levels").id,
                permissions: permissions1
            },
            {
                id: com.find(c => c.name === "say").id,
                permissions: permissions2
            },
            {
                id: com.find(c => c.name === "exec").id,
                permissions: permissions3
            },
            {
                id: com.find(c => c.name === "kill").id,
                permissions: permissions3
            },
            {
                id: com.find(c => c.name === "bind").id,
                permissions: permissions3
            },
            {
                id: com.find(c => c.name === "music").id,
                permissions: permissions3
            },
            {
                id: com.find(c => c.name === "listguilds").id,
                permissions: permissions3
            }
        ]
        await Client.guilds.cache.get(e["server"])?.commands.permissions.set({fullPermissions: full})
    })
})

//Pull events from events.js
for (var logger in eventsFile) {
    //@ts-ignore
    Client.on(logger, eventsFile[logger].bind(null, Client));
}

Client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    
    const command = global.Commands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
})

//Command listener
Client.on('messageCreate', async (message) => {
    if (global.List[1] != undefined && !message.guild && message.author.id == "287372868814372885") {
        (Client.guilds.cache.find(guild => guild.id === String(global.List[0])).channels.cache.find(channel => channel.id === String(global.List[1])) as TextChannel).send(message.content)
    }
    else if (message.channel.id == String(global.List[1]) && message.author.id != "660856814610677761") {
        Client.users.resolve("287372868814372885").send(`**${message.author.username}#${message.author.discriminator}:** ${message.content}`)
        message.attachments.forEach(async a => {
            Client.users.resolve("287372868814372885").send({files: [a]})
        })
    }
    if (!message.guild || message.author.bot || message.webhookId) {
        return;
    }
})

//Load amount of commands
global.Commands = new Collection();
fs.readdir('src/commands', (_err: Error, groups: any[string]) => {
    groups.forEach((group: string) => {
        commandGroups.push(group)
        fs.readdir(`src/commands/${group}`, (_groupErr: Error, comms: any[string]) => {
            comms.forEach((command: string) => {
                const commandData: Command = require(`./commands/${group}/${command}`)
                global.Commands.set(commandData.data.name, commandData)
                if (commandData.data.name == "updates") {
                    updateComm.push(commandData.data.toJSON())
                    return;
                }
                commands.push(commandData.data.toJSON())
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