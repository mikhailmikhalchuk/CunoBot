import Discord from 'discord.js'
const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
var loop = true

module.exports = {
    name: "levels",
    aliases: [],
    desc: "Lists the roles bound to the bot's level measurement.",
    args: "<list|change>",
    level: 0,
    func: async (message: Discord.Message, args: string[]) => {
        if (args[0] == undefined || args[0] == "") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a valid option: `list`, `change`."))
        }
        var level1list
        var level2list
        global.PermissionsList.forEach((e: any[string]) => {
            if (e["server"] == message.guild.id) {
                level1list = e["level1"]
                level2list = e["level2"]
            }
        })
        if (args[0].toLowerCase() == "list") {
            return message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Levels")
                .addField("Level 2", `<@&${level2list}>`)
                .addField("Level 1", `<@&${level1list}>`)
                .addField("Level 0", "@everyone")
                .addField("Your Level", `Level ${await global.Functions.getUserLevel(message.guild, message.member)}`))
        }
        else if (args[0].toLowerCase() == "change") {
            var write1: string
            var write2: string
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
                    else if (c.first().mentions.roles.first() != undefined) {
                        if (c.first().mentions.roles.first().id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                            return message.channel.send("Please mention or paste the ID of a different role.")
                        }
                        write1 = c.first().mentions.roles.first().id
                    }
                    else if (message.guild.roles.cache.find(role => role.id == c.first().content) != undefined) {
                        write1 = c.first().content
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
                            else if (write1 == c.first().content || (c.first().mentions.roles.first() != undefined && write1 == c.first().mentions.roles.first().id) || c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                return message.channel.send("Please mention or paste the ID of a different role.")
                            }
                            else if (c.first().mentions.roles.first() != undefined) {
                                if (c.first().mentions.roles.first().id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                    return message.channel.send("Please mention or paste the ID of a different role.")
                                }
                                write2 = c.first().mentions.roles.first().id
                            }
                            else if (message.guild.roles.cache.find(role => role.id == c.first().content) != undefined) {
                                write2 = c.first().content
                            }
                            else {
                                return message.channel.send("Please mention or paste the ID of a valid role.")
                            }
                            await mongoClient.connect()
                            await mongoClient.db("Servers").collection("Permissions").updateOne({server: message.guild.id}, {$set: {level1: write1, level2: write2}})
                            global.PermissionsList = await mongoClient.db("Servers").collection("Permissions").find({}).toArray();
                            mongoClient.close()
                            return message.channel.send("Successfully changed level 1 and level 2 bot permissions.")
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