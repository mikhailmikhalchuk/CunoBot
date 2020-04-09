module.exports = {
    name: "8ball",
    aliases: [],
    desc: "Has the bot rate the occurance of something.",
    args: "[message]",
    level: "0",
    func: async (message, args) => {
        if (args == "" || args == undefined) {
            message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide a message to rate."))
        }
        else {
            switch (Math.floor(Math.random() * 5)) {
                case 0:
                    message.reply("definitely.")
                    break
                case 1:
                    message.reply("probably.")
                    break
                case 2:
                    message.reply("maybe.")
                    break
                case 3:
                    message.reply("unlikely.")
                    break
                case 4:
                    message.reply("definitely not.")
                    break
            }
        }
    }
}