module.exports = {
    name: "ban",
    aliases: [],
    desc: "Bans a user.",
    args: "<@mention|username> [reason]",
    level: "1",
    func: async (message, args) => {
        const memberData = global.Functions.getMember(message, args.join(' '))
        var res = "No reason provided."
        if (!memberData[0]) {
            return message.channel.send(null, global.Functions.BasicEmbed("error", memberData[1]))
        }
        const member = memberData[1]
        if (!member) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "No users found!"))
        }
        if (args.slice(1).join(" ") != undefined) {
            var res = args.slice(1).join(" ")
        }
        member.ban({reason: res}).then((d) => {
            return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully banned user")).then((m) => m.delete({timeout: 3000}))
        })
        .catch((e) => {
            if (e.message == "Missing Permissions") {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Do not have permissions to ban this user."))
            }
        })
    }
}