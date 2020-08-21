module.exports = {
    name: "pfp",
    aliases: ["avatar"],
    args: "[@mention|username|ID]",
    desc: "Returns a user's avatar.",
    level: "0",
    func: async (message, args) => {
        const memberData = global.Functions.getMember(message, args.join(' '))
        if (!memberData[0]) {
            global.Client.users.fetch(args[0]).then((m) => {
                return message.channel.send(null, global.Functions.BasicEmbed('normal', ' ', ['nothumbnail']).setTitle(`${m.username}'s avatar`).setImage(m.displayAvatarURL({format: 'png', dynamic: true})))
            })
            .catch(() => {
                return message.channel.send(null, global.Functions.BasicEmbed("error", memberData[1]))
            })
        }
        else {
            const member = memberData[1]
            return message.channel.send(null, global.Functions.BasicEmbed('normal', ' ', ['nothumbnail']).setTitle(`${member.displayName}'s avatar`).setImage(member.user.displayAvatarURL({format: 'png', dynamic: true})))
        }
    }
}