const YouTube = require("discord-youtube-api");
const youtube = new YouTube(global.Auth.youtubeapikey);
const ytdl = require('ytdl-core')

module.exports = {
    name: "play",
    aliases: [],
    desc: "Plays an audio resource.",
    args: "<YouTube link>",
    level: "3",
    func: async (message, args) => {
        var pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i')
        if (args[0] == undefined || args[0] == null || !!pattern.test(args[0]) == false || !args[0].includes("youtube")) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide a YouTube link in which to broadcast."))
        }
        var results = await youtube.getVideo(args[0]);
        if (results.duration.minutes > 10) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Cannot play videos that are longer than 10 minutes"))
        }
        message.guild.channels.cache.filter(channel => channel.type === "voice").each(c => {
            if (c.members.find(user => user.id === message.author.id)) {
                c.join().then((connection) => {
                    const dispatcher = connection.play(ytdl(args[0], {quality: 'highestaudio'}))
                    dispatcher.on('speaking', async (value) => {
                        if (value == false) {
                            connection.disconnect()
                        }
                    })
                })
            }
            else {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Please join a voice channel."))
            }
        })
    }
}