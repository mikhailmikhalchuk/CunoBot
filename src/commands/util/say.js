const Discord = require('discord.js');

module.exports = {
    name: "say",
    aliases: ["speak"],
    desc: "Makes the bot send a message.",
    args: "<text>",
    level: "2",
    hidden: true,
    func: (message, args) => {
        //Check if the message has any attachments
        if (message.attachments.size > 0) {
            //Adds attachments and URLs to array
            var Attachment = (message.attachments).array();
            //Creates a new message attachment for each URL
            Attachment.forEach(function (attachment) {
                const att = new Discord.MessageAttachment(attachment.url);
                //Send a space with the attachment to prevent error if args empty
                if (args == "") {
                    message.channel.send(" ", att)
                }
                //Otherwise send args and attachment
                else {
                    message.channel.send(args.join(" "), att)
                }
            })
        }
        else if (args == "" || args == undefined) {
            message.delete()
            return false
        }
        //If not, send the plaintext message
        else {
            message.channel.send(args.join(" "))
        }
            message.delete()
        }
}