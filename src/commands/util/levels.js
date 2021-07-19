const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
var loop = true

module.exports = {
    name: "levels",
    aliases: [],
    desc: "Lists the roles bound to the bot's level measurement.",
    args: "<list|change>",
    level: "0",
    func: async (message, args) => {
        if (args[0] == undefined || args[0] == "") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a valid option: `list`, `change`."))
        }
        await mongoClient.connect()
        const check = await mongoClient.db("Servers").collection("Permissions").findOne({server: message.guild.id})
        mongoClient.close()
        if (args[0].toLowerCase() == "list") {
            if (level1 == "") {
                return message.channel.send(global.Functions.BasicEmbed("normal")
                    .setAuthor("Levels")
                    .addField("Level 2", `<@&${check["level1"]}>`)
                    .addField("Level 0", "@everyone")
                    .addField("Your Level", `Level ${await global.Functions.getUserLevel(message.guild.id, message.member)}`))
            }
            return message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Levels")
                .addField("Level 2", `<@&${check["level2"]}>`)
                .addField("Level 1", `<@&${check["level1"]}>`)
                .addField("Level 0", "@everyone")
                .addField("Your Level", `Level ${await global.Functions.getUserLevel(message.guild.id, message.member)}`))
        }
        else if (args[0].toLowerCase() == "change") {
            var write1
            var write2
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
                            return message.channel.send("Please mention or paste the ID of a different role.")
                        }
                        write1 = c.first().content.mentions.roles.first().id
                    }
                    else if (!isNaN(Number(c.first().content.slice(3, 20)))) {
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
                            else if (write1 == write2 || c.first().content == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                return message.channel.send("Please mention or paste the ID of a different role.")
                            }
                            else if (c.first().content.mentions != undefined) {
                                if (c.first().content.mentions.id == message.guild.roles.cache.find(role => role.name == "@everyone").id) {
                                    return message.channel.send("Please mention or paste the ID of a different role.")
                                }
                                write2 = c.first().content.mentions.roles.first().id
                            }
                            else if (!isNaN(Number(c.first().content.slice(3, 20)))) {
                                write2 = c.first().content
                            }
                            else {
                                return message.channel.send("Please mention or paste the ID of a valid role.")
                            }
                            await mongoClient.connect()
                            await mongoClient.db("Servers").collection("Permissions").updateOne({server: message.guild.id}, {$set: {level1: write1, level2: write2}})
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