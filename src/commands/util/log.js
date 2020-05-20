const logfile = require('C:/Users/Cuno/Documents/DiscordBot/src/data/logging.json')
var logging = true
var loggingtext = "Enabled"
const fs = require('fs');
global.Logging = logging

module.exports = {
    name: "log",
    aliases: ["logs", "logging"],
    desc: "Configures server logging.",
    level: "1",
    func: async (message) => {
        // Never set up logging
        if (logfile[message.guild.id] == undefined || message.guild.channels.resolve(logfile[message.guild.id]) == undefined) {
            if (logfile[message.guild.id] == undefined) message.reply("looks like there isn't a logging channel for this server. Please reply with a channel to set logging to. (\`cancel\` to cancel)")
            else message.reply("looks like the old logging channel was deleted. Please reply with a channel to set logging to. (\`cancel\` to cancel)")
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                var towrite = logfile
                if (c.first().content.toLowerCase() == "cancel") {return message.reply("cancelled command.")}
                else if (c.first().content.search("<#") == -1) {return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))}
                else {
                    if (logfile[message.guild.id] == undefined) {
                        towrite = JSON.stringify(towrite)
                        var towrite = towrite.replace("}", `,"${message.guild.id}":"${c.first().content.slice(2, 20)}"}`)
                    }
                    else if (message.guild.channels.resolve(logfile[message.guild.id]) == undefined) {
                        towrite[message.guild.id] = c.first().content.slice(2, 20)
                        towrite = JSON.stringify(towrite)
                    }
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logging.json', towrite, function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        message.channel.send(global.Functions.BasicEmbed(("normal"), `Successfully set logging channel to ${c.first().content}.\nChanges will take effect on next bot reload.`))
                    })
                }
            })
        }
        // Logging set up and ok
        else {
            message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Logging")
                .setDescription(`**Channel: <#${logfile[message.guild.id]}>\nLogging: ${loggingtext}**\n\n\_\_Please select an option:\_\_\nEnable\nDisable\nChange Channel\nRemove Channel\nCancel`))
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                var res = c.first().content.toLowerCase()
                if (res == "disable" && logging == true) {
                    logging = false
                    loggingtext = "Disabled"
                    message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully disabled logging."))
                    global.Logging = logging
                }
                else if (res == "disable" && logging == false) {message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already disabled."))}
                else if (res == "enable" && logging == false) {
                    logging = true
                    loggingtext = "Enabled"
                    message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully enabled logging."))
                    global.Logging = logging
                }
                else if (res == "enable" && logging == true) {message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already enabled."))}
                else if (res == "change channel") {
                    message.channel.send(global.Functions.BasicEmbed(("normal"), `What would you like to change the logging channel to? (Currently <#${logfile[message.guild.id]}>)`))
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        var towrite = logfile
                        if (c.first().content.search("<#") == -1) {return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))}
                        else {
                            towrite[message.guild.id] = c.first().content.slice(2, 20)
                            fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logging.json', JSON.stringify(towrite), function (err) {
                                if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                                message.channel.send(global.Functions.BasicEmbed(("normal"), `Successfully changed logging channel to ${c.first().content}.\nChanges will take effect on next bot reload.`))
                            })
                        }
                    })
                }
                else if (res == "remove channel") {
                    var towrite = logfile
                    delete towrite[message.guild.id]
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logging.json', JSON.stringify(towrite), function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        message.channel.send(global.Functions.BasicEmbed(("normal"), "Successfully removed logging channel.\nChanges will take effect on next bot reload."))
                    })
                }
                else if (res == "cancel") {return message.reply("cancelled command.")}
                else {return message.channel.send(global.Functions.BasicEmbed(("error"), "Please select a valid option."))}
            })
        }
    }
}