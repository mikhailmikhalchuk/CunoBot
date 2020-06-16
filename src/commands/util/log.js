const logfile = require('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json')
const ignored = require('C:/Users/Cuno/Documents/DiscordBot/src/data/ignoredlogchannels.json');
const logstat = require('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json')
var logging = true
var loggingtext = "Enabled"
const fs = require('fs');
global.Logging = logging
var channellist = []
var reallist = []

function listids(channel) {
    if (JSON.stringify(ignored).search(channel.id) == -1) channellist.push(channel.id)
    else {
        reallist.push(channel.id)
        channellist.push(channel.id)
    }
}

module.exports = {
    name: "log",
    aliases: ["logs", "logging"],
    desc: "Configures server logging.",
    level: "1",
    func: async (message) => {
        // Never set up logging or channel was deleted
        if (logfile[message.guild.id] == undefined || message.guild.channels.resolve(logfile[message.guild.id]) == undefined) {
            if (logfile[message.guild.id] == undefined) message.reply("looks like there isn't a logging channel for this server. Please reply with a channel to set logging to. (\`cancel\` to cancel)")
            else message.reply("looks like the old logging channel was deleted. Please reply with a channel to set logging to. (\`cancel\` to cancel)")
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                var towrite = logfile
                var towrite2 = logstat
                if (c.first().content.toLowerCase() == "cancel") return message.reply("cancelled command.")
                else if (c.first().content.startsWith("<#") == -1) return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                else {
                    if (logfile[message.guild.id] == undefined) {
                        towrite = JSON.stringify(towrite).replace("}", `,"${message.guild.id}":"${c.first().content.slice(2, 20)}"}`)
                        towrite2 = JSON.stringify(towrite2).replace("}", `,"${message.guild.id}":true}`)
                    }
                    else if (message.guild.channels.resolve(logfile[message.guild.id]) == undefined) {
                        towrite[message.guild.id] = c.first().content.slice(2, 20)
                        towrite = JSON.stringify(towrite)
                        towrite2[message.guild.id] = true
                        towrite2 = JSON.stringify(towrite2)
                    }
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json', towrite, function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json', towrite2, function (err) {
                            if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                            message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully set logging channel to ${c.first().content}.`))
                        })
                    })
                }
            })
        }
        // Logging set up and ok
        else {
            message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Logging")
                .setDescription(`**Channel: <#${logfile[message.guild.id]}>\nLogging: ${loggingtext}**\n\n\_\_Please select an option:\_\_\nEnable\nDisable\nChange Channel\nIgnore Channel\nRemove Channel\nCancel`))
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                var towrite2 = logstat
                var res = c.first().content.toLowerCase()
                if (res == "disable" && logstat[message.guild.id] == true) {
                    towrite2[message.guild.id] = false
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json', JSON.stringify(towrite2), function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully disabled logging."))
                    })
                }
                else if (res == "disable" && logstat[message.guild.id] == false) {message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already disabled."))}
                else if (res == "enable" && logstat[message.guild.id] == false) {
                    towrite2[message.guild.id] = true
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logstatus.json', JSON.stringify(towrite2), function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully enabled logging."))
                    })
                }
                else if (res == "enable" && logstat[message.guild.id] == true) {message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already enabled."))}
                else if (res == "change channel") {
                    message.channel.send(global.Functions.BasicEmbed(("normal"), `What would you like to change the logging channel to? (Currently <#${logfile[message.guild.id]}>, \`cancel\` to cancel)`))
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        var towrite = logfile
                        if (c.first().content.toLowerCase() == "cancel") return message.reply("cancelled command.")
                        else if (c.first().content.startsWith("<#") == -1) return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                        else {
                            towrite[message.guild.id] = c.first().content.slice(2, 20)
                            fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json', JSON.stringify(towrite), function (err) {
                                if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                                message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully changed logging channel to ${c.first().content}.`))
                            })
                        }
                    })
                }
                else if (res == "ignore channel") {
                    channellist = []
                    reallist = []
                    message.guild.channels.cache.forEach(listids)
                    if (reallist.toString() == "") var prints = "None"
                    else {
                        var prints = reallist.toString().replace(/,/g, ">, <#")
                        prints = "<#" + prints + ">"
                    }
                    message.channel.send(global.Functions.BasicEmbed(("normal"), `What channel would you like to add to the ignore list? (mention a channel already in the ignore list to remove it, \`cancel\` to cancel).\nChannels currently in the ignored list: ${prints}`))
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        var towrite = ignored
                        if (c.first().content.toLowerCase() == "cancel") return message.reply("cancelled command.")
                        else if (c.first().content.startsWith("<#") == -1 || !channellist.includes(c.first().content.slice(2, 20))) return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                        else {
                            var re = new RegExp(c.first().content.slice(2, 20))
                            if (JSON.stringify(ignored).search(re) != -1) {
                                var removed = true
                                delete towrite[c.first().content.slice(2, 20)]
                                towrite = JSON.stringify(towrite)
                            }
                            else {
                                var removed = false
                                towrite = JSON.stringify(towrite).replace("}", `,"${c.first().content.slice(2, 20)}":true}`)
                            }
                            fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/ignoredlogchannels.json', towrite, function (err) {
                                if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                                if (removed == true) {
                                    message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully removed ${c.first().content} from the ignored list.`))
                                }
                                else {
                                    message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully added ${c.first().content} to the ignored list.`))
                                }
                                delete require.cache[require.resolve('C:/Users/Cuno/Documents/DiscordBot/src/data/ignoredlogchannels.json')]
                            })
                        }
                    })
                }
                else if (res == "remove channel") {
                    var towrite = logfile
                    delete towrite[message.guild.id]
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/logchannels.json', JSON.stringify(towrite), function (err) {
                        if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully removed logging channel."))
                    })
                }
                else if (res == "cancel") return message.reply("cancelled command.")
                else return message.channel.send(global.Functions.BasicEmbed(("error"), "Please select a valid option."))
            })
        }
    }
}