const regex = /<(a?):(.*?):(.*?)>/i

module.exports = {
    name: "emoji",
    aliases: ["emote"],
    args: "<emoji>",
    desc: "Takes an emoji and returns its image, as well as some data.",
    level: "0",
    func: async (message, args) => {
        if (args[0] == undefined) {
            return message.channel.send(global.Functions.BasicEmbed('error', "Please provide an emoji."))
        }
        const msg = args[0]
        const groups = regex.exec(msg)
        if (groups) {
            const id = groups[3]
            return message.channel.send(null, global.Functions.BasicEmbed('normal', ' ', ['nothumbnail'])
                .setTitle("Emoji")
                .addField("Name", groups[2], true)
                .addField("ID", id, true)
                .setImage(`https://cdn.discordapp.com/emojis/${id}.${groups[1] == "a" ? "gif" : "png"}`))
        }
        return message.channel.send(null, global.Functions.BasicEmbed('error', "Emoji not found. This command only works for custom emojis."))
    }
}