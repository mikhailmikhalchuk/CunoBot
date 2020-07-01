const ignored = require('./data/ignoredlogchannels.json');
const prefixes = require('./data/prefixes.json');
const logfile = require('./data/logchannels.json');
const logstat = require('./data/logstatus.json');
const dateFormat = require('dateformat');
const Discord = require('discord.js')
const f = require('./functions.js')
const fs = require('fs');
const events = {}

//Message Deleted
events.messageDelete = async (client, message) => {
    let logs = await message.guild.fetchAuditLogs({type: 72});
    let entry = logs.entries.first();
    if (logfile[message.guild.id] != undefined && message.guild.channels.resolve(logfile[message.guild.id]) != undefined && logstat[message.guild.id] == true && !message.author.bot && entry.executor.id != "660856814610677761" && ignored[message.channel.id] != true && !message.webhookID) {
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
}

//Bulk message deletion
events.messageDeleteBulk = async (client, messages) => {
    var data = messages.first().guild
    let logs = await data.fetchAuditLogs({type: 73})
    let entry = logs.entries.first()
    if (logfile[data.id] != undefined && data.channels.resolve(logfile[data.id]) != undefined && logstat[data.id] == true && entry.executor.id != "660856814610677761" && ignored[messages.first().channel.id] != true) {
        return data.channels.resolve(logfile[data.id]).send(f.BasicEmbed("RED")
            .setAuthor(data.name, data.iconURL({format: 'png', dynamic: true}))
            .setDescription(`**Bulk deletion in <#${messages.first().channel.id}>**\n${messages.array().length} messages deleted.`))
    }
}

//Message Updated
events.messageUpdate = async (client, oldMessage, newMessage) => {
    let logs = await oldMessage.guild.fetchAuditLogs({type: 72});
    let entry = logs.entries.first();
    if (logfile[oldMessage.guild.id] != undefined && oldMessage.guild.channels.resolve(logfile[oldMessage.guild.id]) != undefined && logstat[oldMessage.guild.id] == true && !oldMessage.member.user.bot && entry.executor.id != "660856814610677761" && ignored[oldMessage.channel.id] != true && !message.webhookID) {
            if (oldMessage.attachments.size > 0) {
                var Attachment = (oldMessage.attachments).array()
                var attachments = []
                Attachment.forEach(function (Attachment) {
                    attachments.push(`${Attachment.name}\n`)
                })
                return oldMessage.guild.channels.resolve(logfile[oldMessage.guild.id]).send(f.BasicEmbed("RED")
                .setAuthor(`${oldMessage.author.tag}`, oldMessage.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${oldMessage.member.id}> edited in <#${oldMessage.channel.id}>**\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`)
                .addField("Attachments", attachments))
            }
            return oldMessage.guild.channels.resolve(logfile[oldMessage.guild.id]).send(f.BasicEmbed("RED")
                .setAuthor(`${oldMessage.author.tag}`, oldMessage.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${oldMessage.member.id}> edited in <#${oldMessage.channel.id}>**\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`))
    }
}

//Emoji Added
events.emojiCreate = (client, emoji) => {
    if (logfile[emoji.guild.id] != undefined && emoji.guild.channels.resolve(logfile[emoji.guild.id]) != undefined && logstat[emoji.guild.id] == true) {
        emoji.guild.channels.resolve(logfile[emoji.guild.id]).send(f.BasicEmbed("success")
            .setAuthor("Emoji created")
            .setDescription(`<:${emoji.name}:${emoji.id}> ${emoji.name}`))
    }
}

//Emoji Deleted
events.emojiDelete = (client, emoji) => {
    if (logfile[emoji.guild.id] != undefined && emoji.guild.channels.resolve(logfile[emoji.guild.id]) != undefined && logstat[emoji.guild.id] == true) {
        emoji.guild.channels.resolve(logfile[emoji.guild.id]).send(f.BasicEmbed("RED")
            .setAuthor("Emoji deleted")
            .setDescription(emoji.name))
    }
}

//Emoji Updated
events.emojiUpdate = (client, oldEmoji, newEmoji) => {
    if (logfile[oldEmoji.guild.id] != undefined && oldEmoji.guild.channels.resolve(logfile[oldEmoji.guild.id]) != undefined && logstat[oldEmoji.guild.id] == true) {
        oldEmoji.guild.channels.resolve(logfile[oldEmoji.guild.id]).send(f.BasicEmbed("normal")
            .setAuthor("Emoji updated")
            .setDescription(`<:${oldEmoji.name}:${oldEmoji.id}> ${oldEmoji.name} -> <:${newEmoji.name}:${newEmoji.id}> ${newEmoji.name}`))
    }
}

//Category/channel created
events.channelCreate = (client, channel) => {
    if (channel.type != "dm")
        if (logfile[channel.guild.id] != undefined && channel.guild.channels.resolve(logfile[channel.guild.id]) != undefined && logstat[channel.guild.id] == true) {
            channel.guild.channels.resolve(logfile[channel.guild.id]).send(f.BasicEmbed("success")
                .setAuthor(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}${channel.type == "category" ? "" : " channel"} created`)
                .setDescription(`**Name:** ${channel.name}${channel.type != "category" ? `\n**Category:** ${channel.parent == null ? "None" : channel.parent.name}` : ""}`))
        }
}

//Category/channel deleted
events.channelDelete = (client, channel) => {
    if (logfile[channel.guild.id] != undefined && channel.guild.channels.resolve(logfile[channel.guild.id]) != undefined && logstat[channel.guild.id] == true && channel.type != "dm") {
        channel.guild.channels.resolve(logfile[channel.guild.id]).send(f.BasicEmbed("RED")
            .setAuthor(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}${channel.type == "category" ? "" : " channel"} deleted`)
            .setDescription(`**Name:** ${channel.name}${channel.type != "category" ? `\n**Category:** ${channel.parent == null ? "None" : channel.parent.name}` : ""}`))
    }
}

//Category/channel updated
events.channelUpdate = (client, oldChannel, newChannel) => {
    if (logfile[oldChannel.guild.id] != undefined && oldChannel.guild.channels.resolve(logfile[oldChannel.guild.id]) != undefined && logstat[oldChannel.guild.id] == true && oldChannel.type != "dm") {
        if (oldChannel.topic == newChannel.topic && oldChannel.name == newChannel.name && oldChannel.parent == newChannel.parent) {
            return false
        }
        return oldChannel.guild.channels.resolve(logfile[oldChannel.guild.id]).send(f.BasicEmbed("normal")
            .setAuthor(`${oldChannel.type.charAt(0).toUpperCase() + oldChannel.type.slice(1)}${oldChannel.type == "category" ? "" : " channel"} ${oldChannel.parent != newChannel.parent ? "moved" : "updated"}`)
            .setFooter(`Channel ID: ${newChannel.id}`)
            .addField("Before:", `${oldChannel.name != newChannel.name ? `**Name:** ${oldChannel.name}` : ""}${oldChannel.topic != newChannel.topic ? `\n**Topic:** ${oldChannel.topic}` : ""}${oldChannel.parent != newChannel.parent ? `**Category:** ${oldChannel.parent == null ? "None" : oldChannel.parent.name.charAt(0).toUpperCase() + oldChannel.parent.name.slice(1)}` : ""}`, true)
            .addField("After:", `${oldChannel.name != newChannel.name ? `**Name:** ${newChannel.name}` : ""}${oldChannel.topic != newChannel.topic ? `\n**Topic:** ${newChannel.topic}` : ""}${oldChannel.parent != newChannel.parent ? `**Category:** ${newChannel.parent == null ? "None" : newChannel.parent.name.charAt(0).toUpperCase() + newChannel.parent.name.slice(1)}` : ""}`, true))
    }
}

//Guild join logger
events.guildCreate = (client, guild) => {
    var prefix = prefixes[guild.id]
    if (guild.me.permissions.any("ADMINISTRATOR") == false) {
        guild.channels.cache.find(text => text.type === "text").send(f.BasicEmbed(("normal"), "It seems I do not have administrative permissions in this server.\nI am unable to function correctly without them.\nTry inviting me using [this link](https://discord.com/api/oauth2/authorize?client_id=660856814610677761&permissions=8&scope=bot)."))
        return serverIgnore.push(guild.id)
    }
    if (prefixes[guild.id] != undefined) {
        return guild.channels.cache.find(text => text.type === "text").send(`Thank you for inviting me.\nUse \`${prefix}help\` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#3435.`)
    }
    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/prefixes.json', JSON.stringify(prefixes).replace("}", `,"${guild.id}":"?"}`), function (err) {
        if (err) console.log(err + "\nindex.js 91:13")
        guild.channels.cache.find(text => text.type === "text").send(`Thank you for inviting me.\nUse \`?help\` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#3435.`)
    })
}

//User details updated
events.userUpdate = (client, oldUser, newUser) => {
    oldUser.client.guilds.cache.each(guild => {
        var gm = guild.member(newUser)
        if (gm != null) {
            if (logfile[gm.guild.id] != undefined && gm.guild.channels.resolve(logfile[gm.guild.id]) != undefined && logstat[gm.guild.id] == true) {
                if (oldUser.username != newUser.username) {
                    gm.guild.channels.resolve(logfile[gm.guild.id]).send(f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Name change")
                        .setDescription(`**Before**: ${oldUser.username}\n**After:** ${newUser.username}`))
                }
                else if (oldUser.avatar != newUser.avatar) {
                    gm.guild.channels.resolve(logfile[gm.guild.id]).send(f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Avatar updated")
                        .setThumbnail(newUser.avatarURL())
                        .setDescription(`<@${newUser.id}>`))
                }
                else if (oldUser.discriminator != newUser.discriminator) {
                    gm.guild.channels.resolve(logfile[gm.guild.id]).send(f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Discriminator change")
                        .setDescription(`**Before**: ${oldUser.discriminator}\n**After:** ${newUser.discriminator}`))
                }
            }
        }
    })
}

//Guild member details updated
events.guildMemberUpdate = (client, oldMember, newMember) => {
    if (logfile[newMember.guild.id] != undefined && newMember.guild.channels.resolve(logfile[newMember.guild.id]) != undefined && logstat[newMember.guild.id] == true) {
        if (oldMember.nickname != newMember.nickname) {
            newMember.guild.channels.resolve(logfile[newMember.guild.id]).send(f.BasicEmbed("normal")
                .setAuthor(`${newMember.user.tag}`, newMember.user.avatarURL({format: 'png', dynamic: true}))
                .setTitle("Nickname change")
                .setDescription(`**Before**: ${oldMember.nickname}\n**After:** ${newMember.nickname}`))
        }
    }
}

//Guild member joined
events.guildMemberAdd = (client, member) => {
    var users = member.guild.memberCount
    var j = users % 10, k = users % 100
    if (j == 1 && k != 11) {
        users += "st"
    }
    else if (j == 2 && k != 12) {
        users += "nd"
    }
    else if (j == 3 && k != 13) {
        users += "rd"
    }
    else {
        users += "th"
    }
    if (logfile[member.guild.id] != undefined && member.guild.channels.resolve(logfile[member.guild.id]) != undefined && logstat[member.guild.id] == true) {
        member.guild.channels.resolve(logfile[member.guild.id]).send(f.BasicEmbed("success")
            .setAuthor(`${member.user.tag}`, member.user.avatarURL({format: 'png', dynamic: true}))
            .setTitle("Member joined")
            .setDescription(`<@${member.user.id}> is the ${users} member to join.`))
    }
}

//Guild member left/kicked
events.guildMemberRemove = (client, member) => {
    var d = Date.now()
    if (logfile[member.guild.id] != undefined && member.guild.channels.resolve(logfile[member.guild.id]) != undefined && logstat[member.guild.id] == true) {
        member.guild.channels.resolve(logfile[member.guild.id]).send(f.BasicEmbed("RED")
            .setAuthor(`${member.user.tag}`, member.user.avatarURL({format: 'png', dynamic: true}))
            .setTitle("Member left")
            .setDescription(`<@${member.user.id}> joined ${dateFormat(d - member.joinedTimestamp, `m 'months,' d 'days,' h 'hours'`)} ago.\n**Roles:** ${member.roles.cache.array().join(", ")}`))
    }
}

//Bot session invalidated
events.invalidated = (client) => {
    const d = new Date()
    console.log(`Bot has disconnected.\nSession invalidated at ${dateFormat(d, "h:MM:ss TT")}.`).then(() => {
        process.exit(0)
    })
}

//Bot error encountered
events.error = (client, error) => {
    console.error(error)
}

//Bot warning encountered
events.warn = (client, info) => {
    console.warn(info)
}

//Rate limit hit
events.rateLimit = (client, rateLimitInfo) => {
    const d = new Date()
    console.warn(`Client hit rate limit at ${dateFormat(d, "h:MM:ss TT")}.\nEmitting general info...`)
    console.warn(rateLimitInfo)
}

module.exports = events