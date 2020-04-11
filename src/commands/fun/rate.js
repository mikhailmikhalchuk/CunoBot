module.exports = {
    name: "rate",
    aliases: [],
    desc: "Has the bot rate a message on a scale of 1 to 10.",
    args: "[message]",
    level: "0",
    func: async (message, args) => {
        if (message.mentions.members.first() == undefined) {var men = "oh"}
        else {var men = message.mentions.members.first().id}
        if (args == "" || args == undefined) {
            message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide a message to rate."))
        }
        else if (args.join(" ").includes("@everyone") || args.join(" ").includes("@here")) return false
        else if (args.join(" ").toLowerCase() == "cuno's bot" || args.join(" ").toLowerCase() == "you" || args.join(" ").toLowerCase() == "yourself" || men == "660856814610677761") {
            message.reply(`I'd give myself a 10/10`)
        }
        else if (args.join(" ").toLowerCase() == "me" || args.join(" ").toLowerCase() == "myself" || args.join(" ").toLowerCase() == message.author.username.toLowerCase() || men == message.author.id) {
            message.reply(`I'd give you a ${Math.floor(Math.random() * 11)}/10`)
        }
        else {
            message.reply(`I'd give ${args.join(" ")} a ${Math.floor(Math.random() * 11)}/10`)
        }
    }
}