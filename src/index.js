const prefixes = require('./data/prefixes.json');
const events = require('./events.js');
const readline = require('readline');
const roles = require('./data/roles.json');
const dateFormat = require('dateformat');
const auth = require('./data/auth.json');
const Discord = require('discord.js');
const Intents = require('discord.js');
const Client = new Discord.Client({disableMentions: "everyone", ws: {intents: Intents.ALL}, presence: {activity: {name: "you.", type: "WATCHING"}, status: "online"}});
const f = require('./functions.js');
const fs = require('fs');
const serverIgnore = []
const commands = []

//SET TO TRUE TO IGNORE ALL MESSAGES NOT FROM YOU
var disabled = false
//SET TO TRUE TO IGNORE ALL MESSAGES NOT FROM YOU

//SET TO FALSE TO NOT LOG
var log = false
//SET TO FALSE TO NOT LOG

//Ready listener
Client.on('ready', async () => {
    console.log('Bot has connected.')
    fs.readFile('C:/Users/Cuno/Documents/DiscordBot/reports.txt', 'utf8', function(_err, data) {
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
})

//Pull events from events.js
for (logger in events) {
    Client.on(logger, events[logger].bind(null, Client));
}

//Log errors to file
process.on('unhandledRejection', (reason) => {
    console.log('UnhandledPromiseRejectionWarning:', reason)
    if (log == true) {
        fs.appendFile('C:/Users/Cuno/Documents/DiscordBot/errors.txt', 'UnhandledPromiseRejectionWarning: ' + reason.stack + "\n----\n", 'utf8', function(_err, data) {})
    }
});

//Command listener
Client.on('message', async (message) => {
    if (!message.guild) {
        return false
    }
    else if (global.Disabled == true && message.author.id != "287372868814372885" || message.author.bot || message.webhookID || serverIgnore.includes(message.guild.id)) {
        return false
    }
    const args = message.content.trim().split(" ")
    comm = args.shift()
    prefixes[message.guild.id] == undefined ? prefix = "?" : prefix = prefixes[message.guild.id]
    // AutoMod checks
    /*if (message.content.includes("discord.gg/" || "discordapp.com/invite/") && f.getUserLevel < 1) {
        message.delete()
    }*/
    //Help Command
    if (comm == `${prefix}help` || comm == `${prefix}commands`) {
        //Check if roles set
        if (roles[`${message.guild.id}level2`] == undefined) {
            message.channel.send("Hello!\nIt looks like I do not have administration and moderation roles setup in this server.\nPlease mention or paste the ID of a role to set **Level 1** permissions for it.")
            while (true) {
                await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                    if (c.first().author.bot || c.first().system) {
                        return true
                    }
                    else if (c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                        return message.channel.send("Please mention or paste the ID of a different role.")
                    }
                    else if (c.first().content.mentions != undefined) {
                        if (c.first().content.mentions.id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                            return message.channel.send("Please mention or paste the ID of a different role.")
                        }
                        var level1 = c.first().content.mentions.roles.first().id
                    }
                    else if (!isNaN(Number(c.first().content))) {
                        var level1 = c.first().content
                    }
                    else {
                        return message.channel.send("Please mention or paste the ID of a valid role.")
                    }
                    message.channel.send("Please mention or paste the ID of a role to set **Level 2** permissions for it.")
                    while (true) {
                        await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                            if (c.first().author.bot || c.first().system) {
                                return true
                            }
                            else if (level1 == level2 || c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                return message.channel.send("Please mention or paste the ID of a different role.")
                            }
                            else if (c.first().content.mentions != undefined) {
                                if (c.first().content.mentions.id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                    return message.channel.send("Please mention or paste the ID of a different role.")
                                }
                                var level2 = c.first().content.mentions.roles.first().id
                            }
                            else if (!isNaN(Number(c.first().content))) {
                                var level2 = c.first().content
                            }
                            else {
                                return message.channel.send("Please mention or paste the ID of a valid role.")
                            }
                            fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/roles.json', JSON.stringify(roles).replace("}", `,"${message.guild.id}level1":"${level1}", "${message.guild.id}level2":"${level2}"}`), function (err) {
                                fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/prefixes.json', JSON.stringify(prefixes).replace("}", `,"${message.guild.id}":"?"}`), function (err) {
                                    return message.channel.send("I'm all set up!\nUse \`?help\` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#3435.")
                                })
                            })
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
                Client.channels.resolve(i.channel.id).awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
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
                        message.reply("check your DMs.")
                        return message.author.send(f.BasicEmbed("normal")
                            .setTitle(`Command Help: ${commandData.name}`)
                            .addField("Name", commandData.name, true)
                            .addField("Aliases", commandData.aliases.join(", ") || "N/A", true)
                            .addField('\u200b', '\u200b', true)
                            .addField("Arguments", commandData.args || "N/A", true)
                            .addField("Level", `${commandData.level} (${commandData.level == 3 ? "Bot Owner" : commandData.level == 0 ? "Normal User" : commandData.level == -1 ? "Bot" : message.guild.roles.resolve(roles[`${message.guild.id}level${commandData.level}`]).name})`, true)
                            .addField("Description", commandData.desc))
                        .catch(() => {
                            message.reply("there was an error sending you the help DM. Make sure you do not have the bot blocked.")
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
                            message.reply("there was an error sending you the help DM. Make sure you do not have the bot blocked.")
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
            if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && f.getUserLevel(message.guild.id, message.member) == -1 || roles[`${message.guild.id}level2`] == undefined) {
                return false
            }
            else if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && f.getUserLevel(message.guild.id, message.member) >= command.level) {
                //Executes command
                try {
                    command.func(message, args)
                }
                catch (e) {
                    message.channel.send(f.BasicEmbed(("error"), e.stack))
                }
            }
            else if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && f.getUserLevel(message.guild.id, message.member) < command.level) {
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
global.Roles = roles
global.Disabled = disabled

//Bot login
Client.login(auth.token)