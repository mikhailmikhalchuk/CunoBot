const fs = require('fs')
const dateFormat = require('dateformat');
const userCooldown = {};

module.exports = {
    name: "report",
    aliases: [],
    desc: "Adds a report to the bot's bug list. Do not abuse this command.",
    args: "<message>",
    level: "0",
    func: async (message, args) => {
        if (userCooldown[message.author.id] == false || userCooldown[message.author.id] == undefined || global.Functions.getUserLevel(message.guild.id, message.member) == 3) {
            userCooldown[message.author.id] = true;
            const m = await message.channel.send("Adding to list...")
            const d = new Date();
            if (args == "" || args == undefined) {
                return m.edit("", global.Functions.BasicEmbed(("error"), "Please provide a message to add to the bug list."))
            }
            fs.appendFile('reports.txt', `New report by ${message.member.user.tag} (id: ${message.member.id}) from ${message.guild.name} (id: ${message.guild.id}) on ${dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')}: ${args.join(" ")}\n`, async function (err) {
                message.delete()
                if (err) return message.channel.send(global.Functions.BasicEmbed(("error"), err))
                await m.edit("Successfully added your report to the bug list.")
            })
            setTimeout(() => {userCooldown[message.author.id] = false}, 600000)
        }
        else if (userCooldown[message.author.id] == true) {
            message.reply("you must wait 10 minutes before using this command again!")
        }
    }
}