const ignored = require('./data/ignoredlogchannels.json');
const logfile = require('./data/logchannels.json');
const logstat = require('./data/logstatus.json');
const f = require('./functions.js')
const listeners = {}

//Message Deleted
listeners.messageDelete = async (client, message) => {
    let logs = await message.guild.fetchAuditLogs({type: 72});
    let entry = logs.entries.first();
    message.fetchWebhook().then(() => {
        return false
    })
    .catch(() => {
        if (logfile[message.guild.id] != undefined && message.guild.channels.resolve(logfile[message.guild.id]) != undefined && logstat[message.guild.id] == true && !message.member.user.bot && entry.executor.id != "660856814610677761" && ignored[message.channel.id] != true) {
            if (message.attachments.size > 0) {
                var Attachment = (message.attachments).array()
                var attachments = []
                Attachment.forEach(function (Attachment) {
                    attachments.push(`${Attachment.name}\n`)
                })
                return message.guild.channels.resolve(logfile[message.guild.id]).send(f.BasicEmbed("RED")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`)
                .addField("Attachments", attachments))
            }
            return message.guild.channels.resolve(logfile[message.guild.id]).send(f.BasicEmbed("RED")
            .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
            .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`))
        }
    })
}

//Emoji Added
listeners.emojiCreate = (client, emoji) => {
    if (logfile[emoji.guild.id] != undefined && emoji.guild.channels.resolve(logfile[emoji.guild.id]) != undefined && logstat[emoji.guild.id] == true) {
        emoji.guild.channels.resolve(logfile[emoji.guild.id]).send(f.BasicEmbed("success")
        .setAuthor("Emoji created")
        .setDescription(`<:${emoji.name}:${emoji.id}> ${emoji.name}`))
    }
}

//Emoji Deleted
listeners.emojiDelete = (client, emoji) => {
    if (logfile[emoji.guild.id] != undefined && emoji.guild.channels.resolve(logfile[emoji.guild.id]) != undefined && logstat[emoji.guild.id] == true) {
        emoji.guild.channels.resolve(logfile[emoji.guild.id]).send(f.BasicEmbed("RED")
        .setAuthor("Emoji deleted")
        .setDescription(emoji.name))
    }
}

//Emoji Updated
listeners.emojiUpdate = (client, oldEmoji, newEmoji) => {
    if (logfile[oldEmoji.guild.id] != undefined && oldEmoji.guild.channels.resolve(logfile[oldEmoji.guild.id]) != undefined && logstat[oldEmoji.guild.id] == true) {
        oldEmoji.guild.channels.resolve(logfile[oldEmoji.guild.id]).send(f.BasicEmbed("normal")
        .setAuthor("Emoji updated")
        .setDescription(`<:${oldEmoji.name}:${oldEmoji.id}> ${oldEmoji.name} -> <:${newEmoji.name}:${newEmoji.id}> ${newEmoji.name}`))
    }
}

//Category/channel created
listeners.channelCreate = (client, channel) => {
    if (logfile[channel.guild.id] != undefined && channel.guild.channels.resolve(logfile[channel.guild.id]) != undefined && logstat[channel.guild.id] == true && channel.type != "dm") {
        channel.guild.channels.resolve(logfile[channel.guild.id]).send(f.BasicEmbed("success")
        .setAuthor(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}${channel.type == "category" ? "" : " channel"} created`)
        .setDescription(`**Name:** ${channel.name}`))
    }
}

module.exports = listeners