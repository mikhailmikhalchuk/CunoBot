const server = require('./data/guilds.json');
const logfile = require('./data/logchannels.json');
const logstat = require('./data/logstatus.json');
const role = require('./data/roles.json');
const dateFormat = require('dateformat');
const auth = require('./data/auth.json');
const Discord = require('discord.js');
const Client = new Discord.Client();
const f = require('./functions.js')
const fs = require('fs');
var serverignore = []
const commands = []

//SET TO TRUE IF TESTING COMMANDS TO IGNORE ALL MESSAGES NOT FROM YOU
var testing = false
//SET TO TRUE IF TESTING COMMANDS TO IGNORE ALL MESSAGES NOT FROM YOU

//Ready listener
Client.on('ready', async () => {
    console.log('Bot has connected.')
    if (testing == false) Client.user.setPresence({activity: {name: "you.", type: "WATCHING"}, status: "online"})
    else if (testing == true) Client.user.setStatus("invisible")
    fs.readFile('C:/Users/Cuno/Documents/DiscordBot/reports.txt', 'utf8', function(err, data) {
        if (data == undefined) return
        var reports = 0
        var reportmatches = data.match(/New report/g)
        var x;
        for (x in reportmatches) {var reports = reports + 1}
        if (reports == 0) return
        else if (reports == 1) console.log(`----\nYou have ${reports} unresolved report.`)
        else console.log(`----\nYou have ${reports} unresolved reports.`)
    })
})

Client.on('messageDelete', async (message) => {
    let logs = await message.guild.fetchAuditLogs({type: 72});
    let entry = logs.entries.first();
    if (message.attachments.size > 0) {
        var Attachment = (message.attachments).array()
        var attachments = []
        Attachment.forEach(function (Attachment) {
            attachments.push(`${Attachment.name}\n`)
        })
    }
    if (message.channel.id != "710892567616815116" && logfile[message.guild.id] != undefined && message.guild.channels.resolve(logfile[message.guild.id]) != undefined && logstat[message.guild.id] == true && !message.member.user.bot && entry.executor.id != "660856814610677761") {
        message.fetchWebhook().then((m) => {
            return false
        })
        .catch(() => {
            if (message.attachments.size > 0) {
                message.guild.channels.resolve(logfile[message.guild.id]).send(f.BasicEmbed("red")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`)
                .addField("Attachments", attachments))
            }
            else {
                message.guild.channels.resolve(logfile[message.guild.id]).send(f.BasicEmbed("red")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`))
            }
        })
    }
})

Client.on('guildCreate', async (guild) => {
    var prefix = f.getServerPrefix(guild.id)
    if (guild.me.permissions.any("ADMINISTRATOR") == false) {
        guild.channels.cache.find(text => text.type === "text").send(f.BasicEmbed(("normal"), "It seems I do not have administrative permissions in this server.\nTry inviting me using [this link](https://discord.com/api/oauth2/authorize?client_id=660856814610677761&permissions=8&scope=bot)."))
        serverignore.push(message.guild.id)
    }
    else if (!JSON.stringify(server).includes(guild.id)) {
        guild.channels.cache.find(text => text.type === "text").send(`Thank you for inviting me.\nUse \`${prefix}help\` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#3435.`)
    }
})

//Command listener
Client.on('message', async (message) => {
    if (message.author.id == "660856814610677761") return
    else if (!message.guild) {
        Client.channels.fetch("708415515122598069").then((m) => {
            m.send(`${message.author.tag} » ${message.content}`)
        })
        return
    }
    else if (serverignore.includes(message.guild.id) || testing == true && message.author.id != "287372868814372885") return
    const args = message.content.trim().split(" ")
    comm = args.shift()
    var prefix = f.getServerPrefix(message.guild.id)
    if (comm == "?help" && !JSON.stringify(server).includes(message.guild.id)) {
        message.reply("looks like this server has not been added to the server index. Please contact the bot owner (Cuno#3435).")
        serverignore.push(message.guild.id)
    }
    //Help Command
    if (comm == `${prefix}help` || comm == `${prefix}commands`) {
        if (args[0] == undefined || args[0] == "") {
            var categories = []
            //Finds all categories (folders in src/commands)
            for (var i in commands) { 
                categories.push(i)
            }
            //List available categories
            message.channel.send("Please pick a category from the following (type \`cancel\` to cancel).", f.BasicEmbed(("normal"), categories.join("\n")))
            //Await user response (plaintext)
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                var category = c.first().content.toLowerCase()
                if (category == "cancel") return message.channel.send("Cancelled prompt.")
                else if (category.startsWith(prefix)) var category = category.slice(1)
                //List all commands in category
                if (commands[category]) {
                    const embed = f.BasicEmbed(("normal"), " ").setTitle(`Commands - ${category}`)
                    for (var command in commands[category]) {
                        var commandData = commands[category][command]
                        if (!commandData.hidden) embed.setDescription(embed.description + `**${prefix + commandData.name} ${commandData.args ? commandData.args : ""}** - ${commandData.desc}\n`)
                    }
                    return message.channel.send(`Type \`${prefix}help\` followed by the command name for more information on a specific command.`, embed)
                }
                //Catch error if category is nonexistent
                else return message.channel.send(f.BasicEmbed(("error"), "That category does not exist!"))
            })
        }
        //Command help
        else {
            const searchCommand = args[0]
            //Find if command exists
            for (var group in commands) {
                for (var command in commands[group]) {
                    var commandData = commands[group][command]
                    if (f.commandMatch(commandData, searchCommand) && !commandData.hidden && !f.commandServerHidden(message.guild, commandData.name)) {
                        //Lists command data
                        return message.channel.send(f.BasicEmbed("normal")
                            .setTitle(`Command Help: ${commandData.name}`)
                            .addField("Name", commandData.name, true)
                            .addField("Aliases", commandData.aliases.join(", ") || "N/A", true)
                            .addField('\u200b', '\u200b', true)
                            .addField("Arguments", commandData.args || "N/A", true)
                            .addField("Level", `${commandData.level} (${f.levelToString(message.guild.id, commandData.level)})`, true)
                            .addField("Description", commandData.desc))
                    }
                    else if (searchCommand == "help" || searchCommand == "commands") {
                        return message.channel.send(f.BasicEmbed("normal")
                            .setTitle("Command Help: help")
                            .addField("Name", "help", true)
                            .addField("Aliases", "commands", true)
                            .addField('\u200b', '\u200b', true)
                            .addField("Arguments", "<command>", true)
                            .addField("Level", "0 (Normal User)", true)
                            .addField("Description", "Returns a list of commands from a category, or provides more information on a command."))
                    }
                }
            }

            if (commands[searchCommand]) { // Group
                const embed = f.BasicEmbed("normal", " ").setTitle("Commands")
                for (var command in commands[searchCommand]) {
                    var commandData = commands[searchCommand][command]
                    if (!commandData.hidden && !f.commandServerHidden(message.guild, commandData.name)) embed.setDescription(embed.description + `**${prefix + commandData.name} ${commandData.args ? commandData.args : ""}** - ${commandData.desc}\n`)
                }
                return message.channel.send(`Type \`${prefix}help\` followed by the command name for more information on a specific command.`, embed)
            }
            return message.channel.send(f.BasicEmbed("error", "Command not found."))
        }
    }
    //Other commands
    for (var group in commands) {
        group = commands[group]
        for (var command in group) {
            command = group[command]
            if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && f.commandServerHidden(message.guild, command.name) == true) return false
            //Test command success - command prefix & name exist and user is at correct level
            else if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && f.getUserLevel(message.guild.id, message.member) >= command.level) {
                //Executes command
                try {
                    command.func(message, args)
                }
                //Catch error on miscellaneous command failure
                catch (e) {
                    message.channel.send(f.BasicEmbed(("error"), e))
                }
            }
            //Catch error if user is in DM
            else if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && f.getUserLevel(message.guild.id, message.member) == -1) return false
            //Catch error if user is not at correct level
            else if (comm.slice(0, 1) == prefix && f.commandMatch(command, comm.slice(1)) && f.getUserLevel(message.guild.id, message.member) < command.level) {
                message.channel.send(f.BasicEmbed(("error"), "You do not have the proper permissions to execute this command."))
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
global.Role = role
global.Server = server

//Bot login
Client.login(auth.token)