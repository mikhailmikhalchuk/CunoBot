import Discord from 'discord.js'
var bound = false

module.exports = {
    name: "bind",
    aliases: [],
    desc: "Binds the current channel to the DM.",
    level: 3,
    hidden: true,
    func: (message: Discord.Message) => {
        if (bound == false) {
            message.delete()
            global.List = [message.guild.id, message.channel.id]
            bound = true
            return message.author.send(`Successfully bound to channel ID ${message.channel.id}. Message flow begins from this point onwards.`)
        }
        else {
            message.delete()
            global.List = []
            bound = false
            return message.author.send(`Successfully removed the bind from the current channel. Message flow has ended.`)
        }
    }
}