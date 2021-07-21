import Discord from 'discord.js'
const youtubedl = require('youtube-dl');
var inChannel = false

module.exports = {
    name: "play",
    aliases: [],
    desc: "Plays an audio resource.",
    args: "<YouTube link>",
    level: 3,
    func: async (message: Discord.Message, args: string[]) => {
        message.channel.send(global.Functions.BasicEmbed(("normal"), "Working...")).then((m) => {
            inChannel = false
            var pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i')
            if (args[0] == undefined || args[0] == null || !!pattern.test(args[0]) == false || !args[0].includes("youtube")) {
                return m.edit(global.Functions.BasicEmbed(("error"), "Please provide a YouTube link in which to broadcast."))
            }
            message.guild.channels.cache.filter(channel => channel.type === "voice").each(c => {
                if (c.members.find(user => user.id === message.author.id)) {
                    inChannel = true
                    if ((c as Discord.VoiceChannel).full == false) {
                        (c as Discord.VoiceChannel).join().then((connection) => {
                            connection.play(youtubedl(args[0]))
                            m.edit(global.Functions.BasicEmbed(("normal"), "Playing..."))
                        })
                    }
                    else {
                        return m.edit(global.Functions.BasicEmbed(("error"), "The voice channel you are in is full."))
                    }
                }
            })
            if (inChannel == false) {
                return m.edit(global.Functions.BasicEmbed(("error"), "Please join a voice channel."))
            }
        })
    }
}