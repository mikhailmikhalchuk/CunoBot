module.exports = {
    name: "dm",
    aliases: [],
    desc: "Has the bot send a DM to a user.",
    args: "<userid> <text>",
    level: "3",
    hidden: true,
    func: (message, args) => {
        message.delete()
        if (args[0] == undefined || args[0] == "") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide the ID of the user to send the DM to."))
        }
        else if (args[1] == undefined || args[1] == "") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide a message to send to the user."))
        }
        message.guild.members.fetch(args[0]).then(m => {
            m.send(args.slice(1).join(" "))
        })
        .catch((e) => {
            console.log(e)
            if (e.message.startsWith("Invalid Form Body")) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Could not find user based on provided ID."))
            }
            return message.channel.send(global.Functions.BasicEmbed(("error"), e))
        })
    }
}