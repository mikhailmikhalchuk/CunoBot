const dateFormat = require('dateformat');
var disabled = false;

module.exports = {
    name: "exec",
    aliases: [],
    args: "<code>",
    desc: "Executes JavaScript code from the bot.",
    level: "3",
    hidden: true,
    func: (message, args) => {
        message.delete()
        try {
            //Fail if disabled
            if (disabled == true) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), "The command is currently disabled."))
            }
            //Disabled command on attempted access of sensitive data (such as bot token)
            else if (message.content.match(/auth\./gi) && disabled == false) {
                disabled = true
                const d = new Date()
                console.log(`ALERT | ATTEMPTED ACCESS OF SENSITIVE DATA\n----\nby: ${message.member.user.tag}\nin: ${message.guild.name}\non: ${dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')}\nchannel: #${message.channel.name}\ncontent: \"${message.content}\"\n----\nEXEC COMMAND HAS BEEN DISABLED`)
                return message.channel.send(global.Functions.BasicEmbed(("error"), "The command has been disabled due to an attempted access of sensitive data."))
            }
            //Run code
            eval(args.join(" "))
        }
        //Code unrunnable
        catch {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Could not run JavaScript. Check your code and try again."))
            .then(msg => {
                msg.delete({timeout: 3000})
            })
        }
    }
}