var cachedRatings: any = {"dummy":"4"}
import Discord from 'discord.js'

module.exports = {
    name: "8ball",
    aliases: [],
    desc: "Has the bot rate the occurrence of something.",
    args: "<message>",
    level: 0,
    func: async (message: Discord.Message, args: string[]) => {
        if (args[0] == "" || args == undefined) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide a message to rate."))
        }
        else if (cachedRatings[args.join(" ")] != undefined) {
            return message.reply(cachedRatings[args.join(" ")])
        }
        switch (Math.floor(Math.random() * 5)) {
            case 0:
                message.reply("definitely.")
                cachedRatings = JSON.parse(JSON.stringify(cachedRatings).replace("}", `,"${args.join(" ")}":"definitely."}`))
                break
            case 1:
                message.reply("probably.")
                cachedRatings = JSON.parse(JSON.stringify(cachedRatings).replace("}", `,"${args.join(" ")}":"probably."}`))
                break
            case 2:
                message.reply("maybe.")
                cachedRatings = JSON.parse(JSON.stringify(cachedRatings).replace("}", `,"${args.join(" ")}":"maybe."}`))
                break
            case 3:
                message.reply("unlikely.")
                cachedRatings = JSON.parse(JSON.stringify(cachedRatings).replace("}", `,"${args.join(" ")}":"unlikely."}`))
                break
            case 4:
                message.reply("definitely not.")
                cachedRatings = JSON.parse(JSON.stringify(cachedRatings).replace("}", `,"${args.join(" ")}":"definitely not."}`))
                break
            default:
                message.reply("an error occured while rolling the 8-ball.")
                break
        }
    }
}