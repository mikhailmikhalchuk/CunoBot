module.exports = {
    name: "about",
    aliases: ["user", "member"],
    desc: "Gets information about a user.",
    args: "<@mention|username>",
    level: "0",
    func: async (message, args) => {
        // Grabbing the correct member (and listing if multiple)
        var memberData = global.Functions.getMember(message, args.join(' '))
        if (!memberData[0]) {
            return message.channel.send(null, global.Functions.BasicEmbed("error", memberData[1]))
        }
        var member = memberData[1]
        //No users by name specified
        if (!member) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "No users found!"))
        }
        // Online/Offline/Idle/DND
        var emoji = ""
        var stat = ""
        switch (member.presence.status) {
            case "online":
                emoji = "<:online:666789311722553376>"
                stat = "Online"
                break
            case "offline":
                emoji = "<:offline:666790009399148564>"
                stat = "Offline"
                break
            case "idle":
                emoji = "<:idle:666789999726952454>"
                stat = "Idle"
                break
            case "dnd":
                emoji = "<:dnd:666789986447785986>"
                stat = "DnD"
                break
        }
        //Embed
        message.channel.send(global.Functions.BasicEmbed("normal")
            .setAuthor(member.displayName, member.user.avatarURL({format: 'png', dynamic: true}))
            .addField("Username", member.user.tag, true)
            .addField("ID", member.id, true)
            .addField("Status", `${emoji} ${stat}`, true)
            .addField("Account Creation", member.user.createdAt.toLocaleString('en-US', { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }), true)
            .addField("Joined Server", member.joinedAt.toLocaleString('en-US', { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }), true)
            .addField("Bot Permissions", `${global.Functions.getUserLevel(member)} (${global.Functions.levelToString(message.guild.id, global.Functions.getUserLevel(member))})`, true)
            .addField("Roles", member.roles.cache.array().join(", ")))
    }
}