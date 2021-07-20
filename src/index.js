const events = require('./events.js');
const readline = require('readline');
const manifestVersion = require('./data/manifest-version.json');
const mongodb = require('mongodb');
const auth = require('./data/auth.json');
const mongoClient = new mongodb.MongoClient(auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
const dateFormat = require('dateformat');
const Discord = require('discord.js');
const Intents = require('discord.js');
const axios = require('axios');
const Client = new Discord.Client({disableMentions: "everyone", ws: {intents: Intents.ALL}, presence: {activity: {name: "you | Use ?help for help", type: "WATCHING"}, status: "online"}});
const f = require('./functions.js');
const fs = require('fs');
const commands = []
var permissionsList
var listeningForMessages = []
var prefixList

//Ready listener
Client.on('ready', async () => {
    console.log('Bot has connected.')
    fs.readFile('./reports.txt', 'utf8', function(_err, data) {
        if (data == undefined) {
            return false
        }
        var reports = 0
        var reportmatches = data.match(/New report/g)
        for (x in reportmatches) {
            reports++
        }
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
    .then((m) => {
        if (m.data.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition != manifestVersion.version) {
            console.log("New version of the Destiny Item Manifest available, downloading it now...")
            manifestVersion.version = m.data.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
            axios.get(`https://www.bungie.net${m.data.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition}`, {
                headers: {
                    'X-API-Key': auth.destinyAPI,
                    'User-Agent': auth.destinyUserAgent
                }
            })
            .then((c) => {
                var toWrite = c.data
                fs.writeFile('../../DestinyManifest.json', JSON.stringify(toWrite), function (err) {
                    fs.unlink('./src/data/DestinyManifest.json', function (err) {
                        fs.rename('../../DestinyManifest.json', './src/data/DestinyManifest.json', function (err) {
                            console.log("Successfully downloaded new version of the manifest, restarting bot now...")
                            fs.writeFileSync('./src/data/manifest-version.json', JSON.stringify(manifestVersion, null, "\t"), function (err) {})
                        })
                    })
                })
            })
        }
    })
    .catch((c) => {
        console.log("sus")
    })
})

//Pull events from events.js
for (logger in events) {
    Client.on(logger, events[logger].bind(null, Client));
}

//Command listener
Client.on('message', async (message) => {
    if (global.List[1] != undefined && !message.guild && message.author.id == "287372868814372885") {
        Client.guilds.cache.find(guild => guild.id === String(global.List[0])).channels.cache.find(channel => channel.id === String(global.List[1])).send(message.content)
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
    comm = args.shift()
    var hit = false
    if (global.PrefixList == undefined || global.PermissionsList == undefined) return message.channel.send(f.BasicEmbed(("error"), "The bot is starting up.\nPlease use the command again in a little while."))
    global.PrefixList.forEach((e) => {
        if (e["server"] == message.guild.id) {
            prefix = e["prefix"]
            hit = true
        }
    })
    if (!hit) prefix = "?"
    //Help Command
    if (comm == `${prefix}help` || comm == `${prefix}commands`) {
        //Check if roles set
        var inDB = false;
        global.PermissionsList.forEach((e) => {
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
                    else if (!isNaN(Number(c.first().content))) {
                        var write1 = c.first().content
                    }
                    else {
                        return message.channel.send("Please mention or paste the ID of a valid role.")
                    }
                    message.channel.send(`Awesome! I'll set that as the role for level 1 permissions. Now we'll need a level 2 role. Please mention or paste the ID of a role to set **Level 2** permissions for it.`)
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
                            else if (!isNaN(Number(c.first().content))) {
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
                            message.channel.send("I'm all set up!\nUse \`?help\` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#3435.")
                            return setup = false;
                        })
                    }
                })
            }
        }
        //Help cats
        else if (args[0] == undefined || args[0] == "") {
            var categories = []
            for (var i in commands) { 
                categories.push(i)
            }
            message.reply("check your DMs.")
            message.author.send("Please pick a category from the following (type \`cancel\` to cancel).", f.BasicEmbed(("normal"), categories.join("\n"))).then((i) => {
                Client.channels.resolve(i.channel.id).awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 15000, errors: ['time'] }).then(async c => {
                    var category = c.first().content.toLowerCase()
                    if (category == "cancel") {
                        return message.author.send("Cancelled command.")
                    }
                    else if (category.startsWith(prefix)) {
                        var category = category.slice(1)
                    }
                    if (commands[category]) {
                        const embed = f.BasicEmbed(("normal"), " ").setTitle(`Commands - ${category}`)
                        for (var command in commands[category]) {
                            var commandData = commands[category][command]
                            if (!commandData.hidden) {
                                embed.setDescription(embed.description + `**${prefix + commandData.name} ${commandData.args ? commandData.args : ""}** - ${commandData.desc}\n`)
                            }
                        }
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
            for (var group in commands) {
                for (var command in commands[group]) {
                    var commandData = commands[group][command]
                    if (f.commandMatch(commandData, searchCommand) && !commandData.hidden) {
                        await mongoClient.connect()
                        const check = await mongoClient.db("Servers").collection("Permissions").findOne({server: message.guild.id})
                        mongoClient.close()
                        message.reply("check your DMs.")
                        return message.author.send(f.BasicEmbed("normal")
                            .setTitle(`Command Help: ${commandData.name}`)
                            .addField("Name", commandData.name, true)
                            .addField("Aliases", commandData.aliases.join(", ") || "N/A", true)
                            .addField('\u200b', '\u200b', true)
                            .addField("Arguments", commandData.args || "N/A", true)
                            .addField("Level", `${commandData.level} (${commandData.level == 3 ? "Bot Owner" : commandData.level == 0 ? "Normal User" : commandData.level == -1 ? "Bot" : message.guild.roles.resolve(check[`level${commandData.level}`]).name})`, true)
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
                }
            }
            if (commands[searchCommand]) {
                const embed = f.BasicEmbed("normal", " ").setTitle("Commands")
                for (var command in commands[searchCommand]) {
                    var commandData = commands[searchCommand][command]
                    if (!commandData.hidden) {
                        embed.setDescription(embed.description + `**${prefix + commandData.name} ${commandData.args ? commandData.args : ""}** - ${commandData.desc}\n`)
                    }
                }
                return message.channel.send(`Type \`${prefix}help\` followed by the command name for more information on a specific command.`, embed)
            }
            return message.channel.send(f.BasicEmbed("error", "Command not found."))
        }
    }
    //Command executor
    for (var group in commands) {
        group = commands[group]
        for (var command in group) {
            command = group[command]
            var inDB = false;
            try {
                global.PermissionsList.forEach((e) => {
                    if (e["server"] == message.guild.id) {
                        inDB = true;
                        return;
                    }
                })
            }
            catch (e) {
                console.log(e)
                console.log(`Value of global.PermissionsList: ${global.PermissionsList}`)
            }
            if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && await f.getUserLevel(message.guild.id, message.member) == -1 || inDB == false) {
                return false
            }
            else if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && await f.getUserLevel(message.guild.id, message.member) >= command.level) {
                //Executes command
                try {
                    command.func(message, args)
                }
                catch (e) {
                    message.channel.send(f.BasicEmbed(("error"), e.stack))
                }
            }
            else if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && await f.getUserLevel(message.guild.id, message.member) < command.level) {
                return message.channel.send(f.BasicEmbed(("error"), "You do not have the proper permissions to execute this command."))
            }
        }
    }
})

//Load amount of commands
global.CommandCount = 0
fs.readdir('src/commands', (_err, groups) => {
    groups.forEach(group => {
        commands[group] = []
        fs.readdir(`src/commands/${group}`, (_groupErr, comms) => {
            comms.forEach(async (command) => {
                const commandData = require(`./commands/${group}/${command}`)
                commands[group].push(commandData)
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