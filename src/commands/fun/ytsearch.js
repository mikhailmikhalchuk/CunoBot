const YouTube = require("discord-youtube-api");
const youtube = new YouTube(global.Auth.youtubeapikey);
var quotalimit = false
let userCooldown = {}

module.exports = {
    name: "ytsearch",
    aliases: [],
    desc: "Searches for a video on YouTube and returns the results.",
    args: "<video>",
    level: "0",
    func: async (message, args) => {
        //Global disable
        if (quotalimit == true) return message.channel.send(global.Functions.BasicEmbed(("error"), "This command has been globally disabled."))
        //Checks if timeout is in effect
        else if (userCooldown[message.author.id] == false || userCooldown[message.author.id] == undefined || global.Functions.getUserLevel(message.guild.id, message.member) == 3) {
            if (args == "" || args == undefined) return message.channel.send(global.Functions.BasicEmbed(("error"), "Please enter a search term!"))
            else {
                try {
                    //Placeholder searching
                    const m = await message.channel.send("Searching...")
                    if (args[0].includes("https:")) {
                        try {
                            results = await youtube.getVideo(args[0]);
                        }
                        catch (e) {
                            if (e.code == "ERR_INVALID_ARG_TYPE") return message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide a valid link to search for."))
                            else return message.channel.send(global.Functions.BasicEmbed(("error"), e))
                        }
                    }
                    else results = await youtube.searchVideos(args);
                    //Returns video URL
                    m.edit(`Here's what I found:\n${results.url}`)
                    //Set 60 second timeout for user to prevent spam on API
                    userCooldown[message.author.id] = true
                    setTimeout(() => {userCooldown[message.author.id] = false}, 60000)
                }
                //API error
                catch (e) {
                    if (e.resp.reason == null || e.resp.reason == undefined) return message.channel.send(global.Functions.BasicEmbed(("error"), e))
                    else if (e.resp.reason == "dailyLimitExceeded") {
                        quotalimit = true
                        message.channel.send(global.Functions.BasicEmbed(("error"), "This command is not usable at this time."))
                        console.log("ERROR: YOUTUBE API QUOTA LIMIT EXCEEDED\nCOMMAND AUTOMATICALLY DISABLED GLOBALLY")
                    }
                    else return message.channel.send(global.Functions.BasicEmbed(("error"), e))
                }
            }
        }
        //Send message if user attempts to use command on cooldown
        else if (userCooldown[message.author.id] == true) return message.reply("you must wait 60 seconds before using this command again!")
    }
}