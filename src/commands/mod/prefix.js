const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    name: "prefix",
    aliases: [],
    args: "<prefix>",
    desc: "Changes the server prefix.",
    level: "2",
    func: async (message) => {
        var hit = false
        global.PrefixList.forEach((e) => {
            if (e["server"] == message.guild.id) {
                prefix = e["prefix"]
                hit = true
            }
        })
        if (!hit) prefix = "None"
        message.channel.send(global.Functions.BasicEmbed(("normal"), `What would you like to change the server prefix to? (Currently \`${prefix}\`, \`cancel\` to cancel)`))
        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
            const result = c.first().content
            if (result === prefix) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a new prefix."))
            }
            else if (result.length > 10) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a prefix no more than 10 characters long."))
            }
            else if (result.toLowerCase() == "cancel") {
                return message.reply("cancelled command.")
            }
            await mongoClient.connect()
            await mongoClient.db("Servers").collection("Prefixes").updateOne({server: message.guild.id}, {$set: {prefix: result}})
            global.PrefixList = await mongoClient.db("Servers").collection("Prefixes").find({}).toArray();
            mongoClient.close()
            message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully changed server prefix to \`${result}\`.`))
        })
    }
}