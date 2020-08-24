module.exports = {
    name: "kick",
    aliases: [],
    desc: "Kicks a user.",
    args: "<@mention|username> [reason]",
    level: "1",
    func: async (message, args) => {
        const memberData = global.Functions.getMember(message, args.join(' '))
        var res = "No reason provided"
        if (!memberData[0]) {
            return message.channel.send(null, global.Functions.BasicEmbed("error", memberData[1]))
        }
        else if (args[0] == undefined || args[0] == "") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please specify the user to kick."))
        }
        const member = memberData[1]
        if (!member) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "No users found!"))
        }
        if (args.slice(1).join(" ") != undefined) {
            var res = args.slice(1).join(" ")
        }
        if (message.member.roles.highest.position <= member.roles.highest.position) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Cannot kick users ranked the same or higher than you."))
        }
        member.kick({reason: res}).then((d) => {
            return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully kicked user.")).then((m) => m.delete({timeout: 3000}))
        })
        .catch((e) => {
            if (e.message == "Missing Permissions") {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Do not have permissions to kick this user."))
            }
        })
    }
}