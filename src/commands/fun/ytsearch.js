const YouTube = require("discord-youtube-api");
const youtube = new YouTube(global.Auth.youtubeapikey);
const userCooldown = {}
var quotaLimit = false

module.exports = {
    name: "ytsearch",
    aliases: [],
    desc: "Searches for a video on YouTube and returns the results.",
    args: "<keyword(s)/URL>",
    level: "0",
    func: async (message, args) => {
        if (quotaLimit == true) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "This command is not usable at this time."))
        }
        else if (userCooldown[message.author.id] == false || userCooldown[message.author.id] == undefined || global.Functions.getUserLevel(message.guild.id, message.member) == 3) {
            if (args == "" || args == undefined) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "Please enter a search term."))
            }
            try {
                const m = await message.channel.send("Searching...")
                results = await youtube.searchVideos(args);
                m.edit(`Here's what I found:\n${results.url}`)
                userCooldown[message.author.id] = true
                setTimeout(() => {userCooldown[message.author.id] = false}, 60000)
            }
            catch (e) {
                if (e.resp.reason == null || e.resp.reason == undefined) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), e))
                }
                else if (e.resp.reason == "dailyLimitExceeded") {
                    quotaLimit = true
                    message.channel.send(global.Functions.BasicEmbed(("error"), "This command is not usable at this time."))
                    return console.log("ERROR: YOUTUBE API QUOTA LIMIT EXCEEDED\nCOMMAND AUTOMATICALLY DISABLED GLOBALLY")
                }
                return message.channel.send(global.Functions.BasicEmbed(("error"), e))
            }
        }
        else if (userCooldown[message.author.id] == true) {
            return message.reply("you must wait 60 seconds before using this command again!")
        }
    }
}