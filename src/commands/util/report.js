const fs = require('fs')
const dateFormat = require('dateformat');
var userCooldown = {};

module.exports = {
    name: "report",
    aliases: [],
    desc: "Adds a report to the bot's bug list. Do not abuse this command.",
    args: "[message]",
    level: "0",
    func: async (message, args) => {
        //Check if user is on cooldown or can bypass
        if (userCooldown[message.author.id] == false || userCooldown[message.author.id] == undefined || global.Functions.getUserLevel(message.member) == 3) {
            //Sets cooldown
            userCooldown[message.author.id] = true;
            //Add to list placeholder
            const m = await message.channel.send("Adding to list...")
            //Create date
            var d = new Date();
            //Check for empty message
            if (args == "" || args == undefined) {
                m.edit("", global.Functions.BasicEmbed(("error"), "Please provide a message to add to the bug list!"))
            }
            //Append message to local file (C:\Users\Cuno\Documents\DiscordBot\reports.txt)
            else {
                fs.appendFile('reports.txt', `New report by ${message.member.user.tag} on ${dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')}: ${args.join(" ")}\n`, async function (err) {
                    message.delete()
                    if (err) message.channel.send(global.Functions.BasicEmbed(("error"), err))
                    await m.edit("Successfully added your report to the bug list.")
                })
                //Set the time to wait for 10 minutes
                setTimeout(() => {userCooldown[message.author.id] = false}, 600000)
            }
        }
        //Error if attepted use on cooldown
        else if(userCooldown[message.author.id] == true) {
            message.reply("you must wait 10 minutes before using this command again!")
        }
    }
}