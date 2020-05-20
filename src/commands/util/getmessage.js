const dateFormat = require('dateformat');

module.exports = {
    name: "getmessage",
    aliases: ["getm"],
    desc: "Gets a message based on ID.",
    args: "<id>",
    level: "1",
    func: (message, args) => {
        message.channel.messages.fetch(args[0]).then(m => {
            if (m.content == "") {content = "."}
            else {content = m.content}
            message.channel.send(m.url, global.Functions.BasicEmbed("normal")
            .setAuthor(m.author.username, m.author.avatarURL({format: 'png', dynamic: true}))
            .addField("Content", content)
            .addField("Date sent", dateFormat(m.createdAt, "mmmm dS, yyyy 'at' h:MM TT '(EST)'")))
        })
        .catch((e) => {
            if (e.message.startsWith("Unknown") || e.message.startsWith("404")) {
                message.channel.send(global.Functions.BasicEmbed(("error"), "Message not found."))
            }
            else {
                message.channel.send(global.Functions.BasicEmbed(("error"), e))
            }
        })
    }
}