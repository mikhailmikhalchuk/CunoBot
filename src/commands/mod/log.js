const logfile = require('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json')
const ignored = require('C:/Users/Cuno/Documents/DiscordBot/src/data/ignoredlogchannels.json')
const logstat = require('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json')
const fs = require('fs');
var channelList = []
var realList = []

function listids(channel) {
    if (JSON.stringify(ignored).search(channel.id) == -1) return channelList.push(channel.id)
    realList.push(channel.id)
    channelList.push(channel.id)
}

module.exports = {
    name: "log",
    aliases: ["logs", "logging"],
    desc: "Configures server logging.",
    level: "1",
    func: async (message) => {
        // Never set up logging or channel was deleted
        if (logfile[message.guild.id] == undefined || message.guild.channels.resolve(logfile[message.guild.id]) == undefined) {
            if (logfile[message.guild.id] == undefined) {
                message.reply("looks like there isn't a logging channel for this server. Please reply with a channel to set logging to. (\`cancel\` to cancel)")
            }
            else {
                message.reply("looks like the old logging channel was deleted. Please reply with a channel to set logging to. (\`cancel\` to cancel)")
            }
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                var toWrite = logfile
                var toWrite2 = logstat
                if (c.first().content.toLowerCase() == "cancel") {
                    return message.reply("cancelled command.")
                }
                else if (c.first().content.startsWith("<#") == -1) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                }
                if (logfile[message.guild.id] == undefined) {
                    toWrite = JSON.stringify(toWrite).replace("}", `,"${message.guild.id}":"${c.first().content.slice(2, 20)}"}`)
                    toWrite2 = JSON.stringify(toWrite2).replace("}", `,"${message.guild.id}":true}`)
                }
                else if (message.guild.channels.resolve(logfile[message.guild.id]) == undefined) {
                    toWrite[message.guild.id] = c.first().content.slice(2, 20)
                    toWrite = JSON.stringify(toWrite)
                    toWrite2[message.guild.id] = true
                    toWrite2 = JSON.stringify(toWrite2)
                }
                fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json', toWrite, function (err) {
                    if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json', toWrite2, function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully set logging channel to ${c.first().content}.`))
                    })
                })
            })
        }
        // Logging set up and ok
        else {
            message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Logging")
                .setDescription(`**Channel: <#${logfile[message.guild.id]}>\nLogging: ${logstat[message.guild.id] == false ? "Disabled" : "Enabled"}**\n\n\_\_Please select an option:\_\_\nEnable\nDisable\nChange Channel\nIgnore Channel\nRemove Channel\nCancel`))
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                const res = c.first().content.toLowerCase()
                var toWrite2 = logstat
                if (res == "disable" && logstat[message.guild.id] == true) {
                    toWrite2[message.guild.id] = false
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json', JSON.stringify(toWrite2), function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully disabled logging."))
                    })
                }
                else if (res == "disable" && logstat[message.guild.id] == false) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already disabled."))
                }
                else if (res == "enable" && logstat[message.guild.id] == false) {
                    toWrite2[message.guild.id] = true
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json', JSON.stringify(toWrite2), function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully enabled logging."))
                    })
                }
                else if (res == "enable" && logstat[message.guild.id] == true) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already enabled."))
                }
                else if (res == "change channel") {
                    message.channel.send(global.Functions.BasicEmbed(("normal"), `What would you like to change the logging channel to? (Currently <#${logfile[message.guild.id]}>, \`cancel\` to cancel)`))
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        var toWrite = logfile
                        if (c.first().content.toLowerCase() == "cancel") {
                            return message.reply("cancelled command.")
                        }
                        else if (c.first().content.startsWith("<#") == -1) {
                            return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                        }
                        toWrite[message.guild.id] = c.first().content.slice(2, 20)
                        fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json', JSON.stringify(toWrite), function (err) {
                            if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                            return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully changed logging channel to ${c.first().content}.`))
                        })
                    })
                }
                else if (res == "ignore channel") {
                    channelList = []
                    realList = []
                    message.guild.channels.cache.forEach(listids)
                    if (realList.toString() == "") {
                        var prints = "None"
                    }
                    else {
                        var prints = realList.toString().replace(/,/g, ">, <#")
                        prints = "<#" + prints + ">"
                    }
                    message.channel.send(global.Functions.BasicEmbed(("normal"), `What channel would you like to add to the ignore list? (mention a channel already in the ignore list to remove it, \`cancel\` to cancel).\nChannels currently in the ignored list: ${prints}`))
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        var toWrite = ignored
                        if (c.first().content.toLowerCase() == "cancel") {
                            return message.reply("cancelled command.")
                        }
                        else if (c.first().content.startsWith("<#") == -1 || !channelList.includes(c.first().content.slice(2, 20))) {
                            return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                        }
                        const re = new RegExp(c.first().content.slice(2, 20))
                        if (JSON.stringify(ignored).search(re) != -1) {
                            var removed = true
                            delete toWrite[c.first().content.slice(2, 20)]
                            toWrite = JSON.stringify(toWrite)
                        }
                        else {
                            var removed = false
                            toWrite = JSON.stringify(toWrite).replace("}", `,"${c.first().content.slice(2, 20)}":true}`)
                        }
                        fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/ignoredlogchannels.json', toWrite, function (err) {
                            if (err) {
                                return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                            }
                            if (removed == true) {
                                return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully removed ${c.first().content} from the ignored list.`))
                            }
                            return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully added ${c.first().content} to the ignored list.`))
                        })
                    })
                }
                else if (res == "remove channel") {
                    var toWrite = logfile
                    delete toWrite[message.guild.id]
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json', JSON.stringify(toWrite), function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully removed logging channel."))
                    })
                }
                else if (res == "cancel") {
                    return message.reply("cancelled command.")
                }
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Please select a valid option."))
            })
        }
    }
}