module.exports = {
    name: "purge",
    aliases: ["delete"],
    desc: "Deletes messages as specified by the user.",
    args: "<messages>",
    level: "1",
    func: (message, args) => {
        //Success
        if (args >= 1) {
            try {
                message.channel.bulkDelete(Number(args[0] * 1 + 1))
                message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully deleted ${Number(args[0])} messages.`)
                    .setAuthor("Purged"))
                    .then(msg => {
                        msg.delete({ timeout: 3000 })
                    })
            }
            catch (e) {
                message.channel.send(global.Functions.BasicEmbed(("error"), e))
            }
        }
        //Under 1
        else if (typeof Number(args[0]) == "number" && args < 1) {
            message.channel.send(global.Functions.BasicEmbed(("error"), "You must assign an amount of messages to delete equal to, or greater than, 1."))
        }
        //Not a Number
        else if (isNaN(Number(args[0]))) {
            message.channel.send(global.Functions.BasicEmbed(("error"), `${args[0]} is not a number!`))
        }
    }
}