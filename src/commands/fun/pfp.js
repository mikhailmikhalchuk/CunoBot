module.exports = {
    name: "pfp",
    aliases: ["avatar"],
    args: "<@mention|username>",
    desc: "Returns a user's avatar.",
    level: "0",
    func: async (message, args) => {
        // Grabbing the correct member (and listing if multiple)
        const memberData = global.Functions.getMember(message, args.join(' '))
        if (!memberData[0]) {
            return message.channel.send(null, global.Functions.BasicEmbed("error", memberData[1]))
        }
        const member = memberData[1]
        return message.channel.send(null, global.Functions.BasicEmbed('normal', ' ', ['nothumbnail']).setTitle(`${member.displayName}'s avatar`).setImage(member.user.displayAvatarURL({format: 'png', dynamic: true})))
    }
}