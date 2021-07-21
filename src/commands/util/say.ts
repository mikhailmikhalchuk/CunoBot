import Discord from 'discord.js'

module.exports = {
    name: "say",
    aliases: [],
    desc: "Makes the bot send a message.",
    args: "[channel] <text>",
    level: 2,
    hidden: true,
    func: (message: Discord.Message, args: string[]) => {
        if (message.attachments.size > 0) {
            var Attachment = (message.attachments).array();
            Attachment.forEach(function (attachment: Discord.MessageAttachment) {
                const att = new Discord.MessageAttachment(attachment.url);
                if (args[0] == "") {
                    if (message.mentions.channels.first() != undefined && args[0].slice(2, 20) == message.mentions.channels.first().id) {
                        (message.guild.channels.resolve(message.mentions.channels.first()) as Discord.TextChannel).send((att))
                    }
                    else {
                        message.channel.send(att)
                    }
                }
                else {
                    if (message.mentions.channels.first() != undefined && args[0].slice(2, 20) == message.mentions.channels.first().id) {
                        (message.guild.channels.resolve(message.mentions.channels.first()) as Discord.TextChannel).send((args.slice(1).join(" "), att))
                    }
                    else {
                        message.channel.send(args.join(" "), att)
                    }
                }
            })
        }
        else if (args[0] == "" || args == undefined || message.mentions.channels.first() != undefined && args[1] == undefined) {
            return message.delete()
        }
        else {
            if (message.mentions.channels.first() != undefined && args[0].slice(2, 20) == message.mentions.channels.first().id) {
                (message.guild.channels.resolve(message.mentions.channels.first()) as Discord.TextChannel).send(args.slice(1).join(" "))
            }
            else {
                message.channel.send(args.join(" "))
            }
        }
        message.delete()
    }
}