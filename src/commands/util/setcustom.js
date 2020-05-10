const adding = "module.exports = {\n\tname: \"custom\",\n\tprefix: \"?\",\n\taliases: [],\n\tdesc: \"Executes a command set using ?setcustom.\",\n\tlevel: \"3\",\n\thidden: true,\n\tfunc: async (message, args) => {\n\t\t"
const fs = require('fs');

module.exports = {
    name: "setcustom",
    prefix: "?",
    aliases: [],
    desc: "Serves as a custom command builder using Javascript, to be executed with ?custom.",
    level: "3",
    hidden: true,
    func: async (message, args) => {
        if (args == "" || args == undefined) {
            message.reply("please specify the command data below ([tab] for tab, type \`cancel\` to cancel).")
            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 1.8e+6, errors: ['time']}).then(async c => {
                if (c.first().content.toLowerCase() == "cancel") {
                    message.channel.send("Cancelled prompt.")
                }
                else {
                    message.reply(`is this data correct? (Y/N):\n\`\`\`js\n${c.first().content.replace(/\[tab\]/g, "    ")}\n\`\`\``)
                    message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 1.8e+6, errors: ['time']}).then(async c => {
                        if (c.first().content.toLowerCase() == "y") {
                            fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/commands/util/custom.js', adding + c.first().content.replace(/\[tab\]/g, "    ") + "\n\t}\n}", function (err) {
                                if (err) message.channel.send(global.Functions.BasicEmbed(("error"), err))
                                message.reply("successfully wrote to file.")
                            });
                        }
                        else {
                            message.reply("command aborted.")
                        }
                    })
                }
            })
        }
        else {
            message.reply(`is this data correct? (Y/N):\n\`\`\`js\n${args.join(" ").replace(/\[tab\]/g, "    ")}\n\`\`\``)
            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 1.8e+6, errors: ['time']}).then(async c => {
                if (c.first().content.toLowerCase() == "y") {
                    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/commands/util/custom.js', adding + args.join(" ").replace(/\[tab\]/g, "    ") + "\n\t}\n}", function (err) {
                        if (err) message.channel.send(global.Functions.BasicEmbed(("error"), err))
                        message.reply("successfully wrote to file.")
                    });
                }
                else {
                    message.reply("command aborted.")
                }
            })
        }
    }
}