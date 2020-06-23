const fs = require('fs');
const prefixes = require('C:/Users/Cuno/Documents/DiscordBot/src/data/prefixes.json');

module.exports = {
    name: "prefix",
    aliases: [],
    args: "<prefix>",
    desc: "Changes the server prefix.",
    level: "2",
    func: async (message) => {
        var toWrite = prefixes
        message.channel.send(global.Functions.BasicEmbed(("normal"), `What would you like to change the server prefix to? (Currently \`${prefixes[message.guild.id]}\`, \`cancel\` to cancel)`))
        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
            const result = c.first().content
            if (result === prefixes[message.guild.id]) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a new prefix."))
            }
            else if (result.toLowerCase() == "cancel") {
                return message.reply("cancelled command.")
            }
            toWrite[message.guild.id] = result
            fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/prefixes.json', JSON.stringify(toWrite), function (err) {
                if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully changed server prefix to \`${result}\`.`))
            })
        })
    }
}