import Discord from 'discord.js'
const dateFormat = require('dateformat');
var disabled = false;

module.exports = {
    name: "exec",
    aliases: [],
    args: "<code>",
    desc: "Executes JavaScript code from the bot.",
    level: 3,
    hidden: true,
    func: (message: Discord.Message, args: string[]) => {
        message.delete()
        try {
            if (disabled == true) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "The command is currently disabled."))
            }
            else if (message.content.match(/auth\./gi) && disabled == false) {
                disabled = true
                const d = new Date()
                console.log(`ALERT | ATTEMPTED ACCESS OF SENSITIVE DATA\n----\nby: ${message.member.user.tag}\nin: ${message.guild.name}\non: ${dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')}\nchannel: #${(message.channel as Discord.TextChannel).name}\ncontent: \"${message.content}\"\n----\nEXEC COMMAND HAS BEEN DISABLED`)
                return message.channel.send(global.Functions.BasicEmbed(("error"), "The command has been disabled due to an attempted access of sensitive data."))
            }
            eval(args.join(" "))
        }
        catch {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Could not run JavaScript. Check your code and try again."))
            .then(msg => {
                msg.delete({timeout: 3000})
            })
        }
    }
}