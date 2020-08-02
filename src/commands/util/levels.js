const roles = require('C:/Users/Cuno/Documents/DiscordBot/src/data/roles.json');
const fs = require('fs');
var loop = true

module.exports = {
    name: "levels",
    aliases: [],
    desc: "Lists the roles bound to the bot's level measurement.",
    args: "<list|change>",
    level: "0",
    func: async (message, args) => {
        var level1 = roles[`${message.guild.id}level1`] != undefined ? roles[`${message.guild.id}level1`] : ""
        var level2 = roles[`${message.guild.id}level2`] != undefined ? roles[`${message.guild.id}level2`] : ""
        if (args[0] == undefined || args[0] == "") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a valid option."))
        }
        else if (args[0].toLowerCase() == "list") {
            if (level1 == "") {
                return message.channel.send(global.Functions.BasicEmbed("normal")
                    .setAuthor("Levels")
                    .addField("Level 2", `<@&${level2}>`)
                    .addField("Level 0", "@everyone")
                    .addField("Your Level", `Level ${global.Functions.getUserLevel(message.guild.id, message.member)}`))
            }
            return message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Levels")
                .addField("Level 2", `<@&${level2}>`)
                .addField("Level 1", `<@&${level1}>`)
                .addField("Level 0", "@everyone")
                .addField("Your Level", `Level ${global.Functions.getUserLevel(message.guild.id, message.member)}`))
        }
        else if (args[0].toLowerCase() == "change") {
            var toWrite = roles
            message.channel.send("Please mention or paste the ID of a role to set **Level 1** permissions for it (or `cancel` to cancel).")
            while (loop == true) {
                await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                    if (c.first().author.bot || c.first().system) {
                        return true
                    }
                    else if (c.first().content.toLowerCase() == "cancel") {
                        message.reply("cancelled command.")
                        return loop = false
                    }
                    else if (c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                        return message.channel.send("Please mention or paste the ID of a different role.")
                    }
                    else if (c.first().content.mentions != undefined) {
                        if (c.first().content.mentions.id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                            return schannel.send("Please mention or paste the ID of a different role.")
                        }
                        toWrite[`${message.guild.id}level1`] = c.first().content.mentions.id
                    }
                    else if (!isNaN(Number(c.first().content.slice(3, 20)))) {
                        toWrite[`${message.guild.id}level1`] = c.first().content
                    }
                    else {
                        return message.channel.send("Please mention or paste the ID of a valid role.")
                    }
                    message.channel.send("Please mention or paste the ID of a role to set **Level 2** permissions for it (or `cancel` to cancel).")
                    while (loop == true) {
                        await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                            if (c.first().author.bot || c.first().system) {
                                return true
                            }
                            else if (c.first().content.toLowerCase() == "cancel") {
                                message.reply("cancelled command.")
                                return loop = false
                            }
                            else if (level1 == level2 || c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                return message.channel.send("Please mention or paste the ID of a different role.")
                            }
                            else if (c.first().content.mentions != undefined) {
                                if (c.first().content.mentions.id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                    return schannel.send("Please mention or paste the ID of a different role.")
                                }
                                toWrite[`${message.guild.id}level2`] = c.first().content.mentions.id
                            }
                            else if (!isNaN(Number(c.first().content.slice(3, 20)))) {
                                toWrite[`${message.guild.id}level2`] = c.first().content
                            }
                            else {
                                return message.channel.send("Please mention or paste the ID of a valid role.")
                            }
                            fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/roles.json', JSON.stringify(toWrite), function (err) {
                                return message.channel.send("Successfully changed level 1 and level 2 bot permissions.")
                            })
                        })
                    }
                })
            }
        }
        else {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a valid option."))
        }
    }
}