module.exports = {
    name: "purge",
    aliases: ["delete"],
    desc: "Bulk deletes messages.",
    args: "<#>",
    level: "1",
    admin: true,
    func: (message, args) => {
        if (Number(args[0]) >= 100) {
            message.delete()
            return message.channel.send(global.Functions.BasicEmbed(("error"), "You cannot delete more than 100 messages.")).then(msg => {msg.delete({timeout: 3000})})
        }
        else if (typeof Number(args[0]) == "number" && Number(args[0]) < 1) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "You must assign an amount of messages to delete equal to or greater than 1."))
        }
        else if (isNaN(Number(args[0]))) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), `${args[0]} is not a number!`))
        }
        message.channel.bulkDelete(Number(args[0]) + 1, true).then((m) => {
            var messages = m.size == 2 ? "message" : "messages"
            if (m.size == 1) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Cannot delete messages older than 14 days.")).then(msg => {msg.delete({timeout: 3000})})
            }
            else if (m.size < Number(args[0]) + 1) {
                return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully deleted ${m.size - 1} ${messages}.\n${Number(args[0]) + 1 - m.size} could not be deleted.`)
                    .setAuthor("Purged"))
                    .then(msg => {msg.delete({timeout: 3000})})
            }
            return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully deleted ${m.size - 1} ${messages}.`)
                .setAuthor("Purged"))
                .then(msg => {msg.delete({timeout: 3000})})
        })
    }
}