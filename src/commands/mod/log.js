const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    name: "log",
    aliases: ["logs", "logging"],
    desc: "Configures server logging.",
    level: "1",
    func: async (message) => {
        // Never set up logging or channel was deleted
        await mongoClient.connect()
        const check = await mongoClient.db("Servers").collection("Logging").findOne({server: message.guild.id})
        mongoClient.close()
        if (check == undefined || message.guild.channels.resolve(check["channel"]) == undefined) {
            message.reply("I cannot find a logging channel for this server in my database. Please mention a channel to set logging to. (\`cancel\` to cancel)")
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                if (c.first().content.toLowerCase() == "cancel") {
                    return message.reply("cancelled command.")
                }
                else if (c.first().content.startsWith("<#") == false) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                }
                await mongoClient.connect()
                var db = mongoClient.db("Servers").collection("Logging")
                if (check != undefined && message.guild.channels.resolve(check["channel"]) == undefined) {
                    await db.updateOne({server: message.guild.id}, {$set: {channel: c.first().content.slice(2, 20), status: true}})
                }
                else {
                    await db.insertOne({server: message.guild.id, channel: c.first().content.slice(2, 20), status: true})
                }
                mongoClient.close()
                return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully set logging channel to ${c.first().content}.`))
            })
        }
        // Logging set up and ok
        else {
            message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Logging")
                .setDescription(`**Channel: <#${check["channel"]}>\nLogging: ${check["status"] == false ? "Disabled" : "Enabled"}**\n\n\_\_Please select an option:\_\_\nEnable\nDisable\nChange Channel\nIgnore Channel\nRemove Channel\nCancel`))
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                const res = c.first().content.toLowerCase()
                if (res == "disable" && check["status"] == true) {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Logging").updateOne({server: message.guild.id}, {$set: {status: false}})
                    mongoClient.close()
                    return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully disabled logging."))
                }
                else if (res == "disable" && check["status"] == false) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already disabled."))
                }
                else if (res == "enable" && check["status"] == false) {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Logging").updateOne({server: message.guild.id}, {$set: {status: true}})
                    mongoClient.close()
                    return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully enabled logging."))
                }
                else if (res == "enable" && check["status"] == true) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Logging already enabled."))
                }
                else if (res == "change channel") {
                    message.channel.send(global.Functions.BasicEmbed(("normal"), `What would you like to change the logging channel to? (Currently <#${check["channel"]}>, \`cancel\` to cancel)`))
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        if (c.first().content.toLowerCase() == "cancel") {
                            return message.reply("cancelled command.")
                        }
                        else if (c.first().content.startsWith("<#") == false) {
                            return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)"))
                        }
                        else if (c.first().content.slice(2, 20) == check["channel"]) {
                            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a different channel."))
                        }
                        await mongoClient.connect()
                        await mongoClient.db("Servers").collection("Logging").updateOne({server: message.guild.id}, {$set: {channel: c.first().content.slice(2, 20)}})
                        mongoClient.close()
                        return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully changed logging channel to ${c.first().content}.`))
                    })
                }
                else if (res == "ignore channel") {
                    message.channel.send(global.Functions.BasicEmbed(("normal"), `What channel would you like to add to the ignore list? (mention a channel already in the ignore list to remove it, \`cancel\` to cancel).\nChannels currently in the ignored list: ${check["ignored"] == undefined ? "None" : "<#" + check["ignored"].toString().replace(/,/g, ">, <#") + ">"}`))
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        if (c.first().content.toLowerCase() == "cancel") {
                            return message.reply("cancelled command.")
                        }
                        else if (c.first().content.startsWith("<#") == false && !check["ignored"].includes(c.first().content.slice(2, 20))) {
                            return message.channel.send(global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to ignore/unignore. (EX: #logging)"))
                        }
                        await mongoClient.connect()
                        if (check["ignored"] == undefined) {
                            const newList = []
                            newList.push(c.first().content.slice(2, 20))
                            await mongoClient.db("Servers").collection("Logging").updateOne({server: message.guild.id}, {$set: {ignored: newList}})
                            mongoClient.close()
                            return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully added ${c.first().content} to the ignored list.`))
                        }
                        if (check["ignored"].toString().includes(c.first().content.slice(2, 20)) == true) {
                            var newList = check["ignored"].splice(check["ignored"].indexOf(c.first().content.slice(2, 20)) - 1, 1)
                            if (newList.length == 1) {
                                newList = undefined
                            }
                            await mongoClient.db("Servers").collection("Logging").updateOne({server: message.guild.id}, {$set: {ignored: newList}})
                            mongoClient.close()
                            return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully removed ${c.first().content} from the ignored list.`))
                        }
                        else {
                            const newList = check["ignored"]
                            newList.push(c.first().content.slice(2, 20))
                            await mongoClient.db("Servers").collection("Logging").updateOne({server: message.guild.id}, {$set: {ignored: newList}})
                            mongoClient.close()
                            return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully added ${c.first().content} to the ignored list.`))
                        }
                    })
                }
                else if (res == "remove channel") {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Logging").updateOne({server: message.guild.id}, {$set: {channel: undefined}})
                    mongoClient.close()
                    return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully removed logging channel."))
                }
                else if (res == "cancel") {
                    return message.reply("cancelled command.")
                }
                else {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Please select a valid option."))
                }
            })
        }
    }
}