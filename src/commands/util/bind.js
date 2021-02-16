var binded = false

module.exports = {
    name: "bind",
    aliases: [],
    desc: "Binds the current channel to the DM.",
    level: "3",
    hidden: true,
    admin: true,
    func: (message, args) => {
        if (binded == false) {
            message.delete()
            global.List = [message.guild.id, message.channel.id]
            binded = true
            return message.author.send(`Successfully bound to channel ID ${message.channel.id}. Message flow begins from this point onwards.`)
        }
        else {
            message.delete()
            global.List = ""
            binded = false
            return message.author.send(`Successfully removed the bind from the current channel. Message flow has ended.`)
        }
    }
}