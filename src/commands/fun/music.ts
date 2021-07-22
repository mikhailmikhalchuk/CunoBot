import Discord from 'discord.js'
import youtubedl from 'youtube-dl';
var currentChannel: Discord.VoiceConnection;
var currentAudio: Discord.StreamDispatcher;

module.exports = {
    name: "music",
    aliases: [],
    desc: "Plays, alters, or stops an audio resource.",
    args: "<play|stop|pause|resume> <YouTube link|keyword(s)>",
    level: 3,
    func: async (message: Discord.Message, args: string[]) => {
        message.channel.send(global.Functions.BasicEmbed(("normal"), "Working...")).then((m) => {
            if (args[0].toLowerCase() == "play") {
                var inChannel = false
                var pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i')
                if (args[1] == undefined || args[1] == null) {
                    return m.edit(global.Functions.BasicEmbed(("error"), "Please provide a YouTube link or keyword(s)."))
                }
                var link = "None"
                if (!!pattern.test(args[1]) == true && args[1].includes("youtube")) {
                    link = args[1]
                }
                message.guild.channels.cache.filter(channel => channel.type === "voice").each(async c => {
                    if (c.members.find(user => user.id === message.author.id)) {
                        inChannel = true
                        if ((c as Discord.VoiceChannel).full == false) {
                            m.edit(global.Functions.BasicEmbed(("normal"), "Getting audio..."))
                            var name = ""
                            var search = link
                            if (search == "None") search = `ytsearch:${args.join(" ")}`;
                            youtubedl.getInfo(search, function (err: Error, info: any) {
                                link = `https://youtube.com/watch?v=${info.id}`
                                name = info.title
                                m.edit(global.Functions.BasicEmbed(("normal"), "Joining voice channel..."));
                                (c as Discord.VoiceChannel).join().then((connection: Discord.VoiceConnection) => {
                                    const stream = youtubedl(link, [], {})
                                    currentChannel = connection;
                                    currentAudio = connection.play(stream)
                                    m.edit(global.Functions.BasicEmbed(("success"), `Now playing [${name}](${link}).`))
                                    currentAudio.on('finish', function (info: string) {
                                        currentAudio.destroy()
                                        currentChannel.disconnect()
                                        currentChannel = undefined
                                        currentAudio = undefined
                                        m.edit(global.Functions.BasicEmbed(("success"), "Song finished!"))
                                    })
                                })
                            });
                        }
                        else {
                            return m.edit(global.Functions.BasicEmbed(("error"), "The voice channel you are in is full."))
                        }
                    }
                })
                if (inChannel == false) {
                    return m.edit(global.Functions.BasicEmbed(("error"), "Please join a voice channel."))
                }
            }
            else if (args[0].toLowerCase() == "stop") {
                if (currentChannel == undefined) return m.edit(global.Functions.BasicEmbed(("error"), "No audio playing."))
                currentAudio.destroy()
                currentChannel.disconnect()
                currentChannel = undefined
                currentAudio = undefined
                return m.edit(global.Functions.BasicEmbed(("success"), "Stopped audio."))
            }
            else if (args[0].toLowerCase() == "pause") {
                if (currentAudio == undefined) return m.edit(global.Functions.BasicEmbed(("error"), "No audio playing."))
                if (currentAudio.paused) return m.edit(global.Functions.BasicEmbed(("error"), "Audio is already paused!"))
                currentAudio.pause()
                return m.edit(global.Functions.BasicEmbed(("success"), "Paused audio."))
            }
            else if (args[0].toLowerCase() == "resume") {
                if (currentAudio == undefined) return m.edit(global.Functions.BasicEmbed(("error"), "No audio playing."))
                if (!currentAudio.paused) return m.edit(global.Functions.BasicEmbed(("error"), "Audio is already playing!"))
                currentAudio.resume()
                return m.edit(global.Functions.BasicEmbed(("success"), "Resumed audio."))
            }
            else {
                return m.edit(global.Functions.BasicEmbed(("error"), "Please provide a valid argument: `play`, `stop`, `resume`, `pause`."))
            }
        })
    }
}