import Discord from 'discord.js'
import fs from 'fs';
import dateFormat from 'dateformat';
const userCooldown: any = {};

module.exports = {
    name: "report",
    aliases: [],
    desc: "Adds a report to the bot's bug list. Do not abuse this command.",
    args: "<message>",
    level: 0,
    func: async (message: Discord.Message, args: string[]) => {
        if (userCooldown[message.author.id] == false || userCooldown[message.author.id] == undefined || await global.Functions.getUserLevel(message.guild, message.member) == 3) {
            userCooldown[message.author.id] = true;
            const m = await message.channel.send("Adding to list...")
            const d = new Date();
            if (args[0] == "" || args == undefined) {
                return m.edit("", global.Functions.BasicEmbed(("error"), "Please provide a message to add to the bug list."))
            }
            fs.appendFile('reports.txt', `New report by ${message.member.user.tag} (id: ${message.member.id}) from ${message.guild.name} (id: ${message.guild.id}) on ${dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')}: ${args.join(" ")}\n`, async function (err: Error) {
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