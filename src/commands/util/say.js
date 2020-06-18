const Discord = require('discord.js');

module.exports = {
    name: "say",
    aliases: [],
    desc: "Makes the bot send a message.",
    args: "[channel] <text>",
    level: "2",
    hidden: true,
    func: (message, args) => {
        if (message.attachments.size > 0) {
            var Attachment = (message.attachments).array();
            Attachment.forEach(function (attachment) {
                const att = new Discord.MessageAttachment(attachment.url);
                if (args == "") {
                    if (message.mentions.channels != undefined) message.guild.channels.resolve(message.mentions.channels.first()).send((" ", att))
                    else message.channel.send(" ", att)
                }
                else {
                    if (message.mentions.channels != undefined) message.guild.channels.resolve(message.mentions.channels.first()).send((args.slice(1).join(" "), att))
                    else message.channel.send(args.join(" "), att)
                }
            })
        }
        else if (args == "" || args == undefined) return message.delete()
        else {
            if (message.mentions.channels.first() != undefined) message.guild.channels.resolve(message.mentions.channels.first()).send(args.slice(1).join(" "))
            else message.channel.send(args.join(" "))
        }
            message.delete()
        }
}