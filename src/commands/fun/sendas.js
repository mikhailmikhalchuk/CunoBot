module.exports = {
    name: "sendas",
    aliases: [],
    desc: "Sends a message with a webhook with the name and image provided by the user.",
    args: "<name> <image/URL> <message>",
    level: "0",
    func: async (message, args) => {
        message.delete()
        if (args[0] == undefined || args[1] == undefined || args[2] == undefined && !message.attachments.first()) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "An argument is missing."))
        }
        message.channel.createWebhook(args[0], {avatar: message.attachments.first() ? message.attachments.first().url : args[1]}).then((w) => {
            w.send(args.slice(message.attachments.first() ? 1 : 2).join(" ")).then(() => {w.delete()})
        })
        .catch((e) => {
            if (e.message.startsWith("ENOENT: no such file or directory, stat")) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Misplaced argument."))
            }
            else {
                return message.channel.send(global.Functions.BasicEmbed(("error"), e))
            }
        })
    }
}