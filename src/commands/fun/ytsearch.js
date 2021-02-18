const youtubedl = require("youtube-dl");

module.exports = {
    name: "ytsearch",
    aliases: [],
    desc: "Searches for a video on YouTube and returns the results.",
    args: "<keyword(s)/URL>",
    level: "0",
    func: async (message, args) => {
        if (args == "" || args == undefined) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please enter a search term."))
        }
        const m = await message.channel.send("Searching...")
        youtubedl.getInfo(`ytsearch:${args.join(" ")}`, function (err, info) {
            m.edit(`Here's what I found:\nhttps://youtube.com/watch?v=${info.id}`)
        })
    }
}