const prefixes = require('./data/prefixes.json');
const auth = require('./data/auth.json')
const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
const dateFormat = require('dateformat');
const f = require('./functions.js')
const fs = require('fs');
const events = {}

//Message Deleted
events.messageDelete = async (client, message) => {
    if (message.channel.type == "dm") {
        return false
    }
    await mongoClient.connect()
    var check = await mongoClient.db("Servers").collection("Logging").findOne({server: message.guild.id})
    mongoClient.close()
    if (check != undefined && check["ignored"] == undefined) check["ignored"] = [];
    if (check != undefined && message.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && !message.author.bot && !check["ignored"].toString().includes(message.channel.id) && !message.webhookID && !message.system) {
        if (message.attachments.size > 0) {
            var Attachment = (message.attachments).array()
            var attachments = []
            Attachment.forEach(function (Attachment) {
                attachments.push(`${Attachment.name}\n`)
            })
            return message.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("RED")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`)
                .addField("Attachments", attachments)
            )
        }
        return message.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("RED")
            .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
            .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`)
        )
    }
}

//Bulk message deletion
events.messageDeleteBulk = async (client, messages) => {
    await mongoClient.connect()
    var check = await mongoClient.db("Servers").collection("Logging").findOne({server: messages.first().guild.id})
    mongoClient.close()
    if (check != undefined && check["ignored"] == undefined) check["ignored"] = [];
    var data = messages.first().guild
    let logs = await data.fetchAuditLogs({type: 73})
    let entry = logs.entries.first()
    if (check != undefined && data.channels.resolve(check["channel"]) != undefined && check["status"] == true && entry.executor.id != "660856814610677761" && !check["ignored"].toString().includes(messages.first().channel.id)) {
        return data.channels.resolve(check["channel"]).send(f.BasicEmbed("RED")
            .setAuthor(data.name, data.iconURL({format: 'png', dynamic: true}))
            .setDescription(`**Bulk deletion in <#${messages.first().channel.id}>**\n${messages.array().length} messages deleted.`)
        )
    }
}

//Message Updated
events.messageUpdate = async (client, oldMessage, newMessage) => {
    if (oldMessage.channel.type == "dm") {
        return false
    }
    if (newMessage.embeds.length != 0 || oldMessage.embeds.length != newMessage.embeds.length || newMessage.pinned != oldMessage.pinned) {
        return false
    }
    await mongoClient.connect()
    var check = await mongoClient.db("Servers").collection("Logging").findOne({server: oldMessage.guild.id})
    mongoClient.close()
    if (check != undefined && check["ignored"] == undefined) check["ignored"] = [];
    else if (check != undefined && oldMessage.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && !oldMessage.author.bot && !check["ignored"].toString().includes(oldMessage.channel.id) && !oldMessage.webhookID) {
        if (oldMessage.attachments.size > 0) {
            var Attachment = (oldMessage.attachments).array()
            var attachments = []
            Attachment.forEach(function (Attachment) {
                attachments.push(`${Attachment.name}\n`)
            })
            return oldMessage.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
                .setAuthor(`${oldMessage.author.tag}`, oldMessage.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${oldMessage.member.id}> edited in <#${oldMessage.channel.id}>**\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`)
                .addField("Attachments", attachments)
            )
        }
        return oldMessage.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
            .setAuthor(`${oldMessage.author.tag}`, oldMessage.author.avatarURL({format: 'png', dynamic: true}))
            .setDescription(`**Message sent by <@${oldMessage.member.id}> edited in <#${oldMessage.channel.id}>**\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`)
        )
    }
}

//Emoji Added
events.emojiCreate = async (client, emoji) => {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: emoji.guild.id})
    mongoClient.close()
    if (check != undefined && emoji.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        if (emoji.animated == false) {
            return emoji.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("success")
                .setAuthor("Emoji created")
                .setDescription(`<:${emoji.name}:${emoji.id}> ${emoji.name}`)
            )
        }
        return emoji.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("success")
            .setAuthor("Emoji created")
            .setDescription(`<a:${emoji.name}:${emoji.id}> ${emoji.name}`)
        )
    }
}

//Emoji Deleted
events.emojiDelete = async (client, emoji) => {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: emoji.guild.id})
    mongoClient.close()
    if (check != undefined && emoji.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        emoji.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("RED")
            .setAuthor("Emoji deleted")
            .setDescription(emoji.name)
        )
    }
}

//Emoji Updated
events.emojiUpdate = async (client, oldEmoji, newEmoji) => {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: oldEmoji.guild.id})
    mongoClient.close()
    if (check != undefined && oldEmoji.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        if (newEmoji.animated == false) {
            return oldEmoji.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
                .setAuthor("Emoji updated")
                .setDescription(`<:${oldEmoji.name}:${oldEmoji.id}> ${oldEmoji.name} -> <:${newEmoji.name}:${newEmoji.id}> ${newEmoji.name}`)
            )
        }
        oldEmoji.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
                .setAuthor("Emoji updated")
                .setDescription(`<a:${oldEmoji.name}:${oldEmoji.id}> ${oldEmoji.name} -> <a:${newEmoji.name}:${newEmoji.id}> ${newEmoji.name}`)
            )
    }
}

//Category/channel created
events.channelCreate = async (client, channel) => {
    if (channel.type == "dm") return;
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: channel.guild.id})
    mongoClient.close()
    if (check != undefined && channel.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        channel.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("success")
            .setAuthor(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}${channel.type == "category" ? "" : " channel"} created`)
            .setDescription(`**Name:** ${channel.name}${channel.type != "category" ? `\n**Category:** ${channel.parent == null ? "None" : channel.parent.name}` : ""}`)
        )
    }
}

//Category/channel deleted
events.channelDelete = async (client, channel) => {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: channel.guild.id})
    mongoClient.close()
    if (check != undefined && channel.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && channel.type != "dm") {
        channel.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("RED")
            .setAuthor(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}${channel.type == "category" ? "" : " channel"} deleted`)
            .setDescription(`**Name:** ${channel.name}${channel.type != "category" ? `\n**Category:** ${channel.parent == null ? "None" : channel.parent.name}` : ""}`)
        )
    }
}

//Category/channel updated
events.channelUpdate = async (client, oldChannel, newChannel) => {
    if (oldChannel.topic == newChannel.topic && oldChannel.name == newChannel.name && oldChannel.parent == newChannel.parent) return;
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: oldChannel.guild.id})
    mongoClient.close()
    if (check != undefined && oldChannel.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && oldChannel.type != "dm") {
        return oldChannel.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
            .setAuthor(`${oldChannel.type.charAt(0).toUpperCase() + oldChannel.type.slice(1)}${oldChannel.type == "category" ? "" : " channel"} ${oldChannel.parent != newChannel.parent ? "moved" : "updated"}`)
            .setFooter(`Channel ID: ${newChannel.id}`)
            .addField("Before:", `${oldChannel.name != newChannel.name ? `**Name:** ${oldChannel.name}` : ""}${oldChannel.topic != newChannel.topic ? oldChannel.topic == null ? "\n**Topic:** " : `\n**Topic:** ${oldChannel.topic}` : ""}${oldChannel.parent != newChannel.parent ? `**Category:** ${oldChannel.parent == null ? "None" : oldChannel.parent.name.charAt(0).toUpperCase() + oldChannel.parent.name.slice(1)}` : ""}`, true)
            .addField("After:", `${oldChannel.name != newChannel.name ? `**Name:** ${newChannel.name}` : ""}${oldChannel.topic != newChannel.topic ? `\n**Topic:** ${newChannel.topic}` : ""}${oldChannel.parent != newChannel.parent ? `**Category:** ${newChannel.parent == null ? "None" : newChannel.parent.name.charAt(0).toUpperCase() + newChannel.parent.name.slice(1)}` : ""}`, true)
        )
    }
}

//Guild join logger
events.guildCreate = async (client, guild) => {
    var prefix = prefixes[guild.id]
    var schannel = guild.channels.cache.find(text => text.type === "text")
    if (guild.me.permissions.any("SEND_MESSAGES") == false) {
        guild.leave()
    }
    if (guild.me.permissions.any("ADMINISTRATOR") == false) {
        schannel.send(f.BasicEmbed(("normal"), "It seems I do not have administrative permissions in this server.\nI am unable to function correctly without them.\nTry re-inviting me using [this link](https://discord.com/api/oauth2/authorize?client_id=660856814610677761&permissions=8&scope=bot)."))
        guild.leave()
        return
    }
    if (global.PermissionsCheck == undefined) {
        var setup = true;
        schannel.send("Hello!\nIt looks like I do not have administration and moderation roles setup in this server.\nPlease mention or paste the ID of a role to set **Level 1** permissions for it.")
        while (setup == true) {
            await schannel.awaitMessages(m => m.member.permissions.any("ADMINISTRATOR") == true, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                if (c.first().author.bot || c.first().system) {
                    return true
                }
                else if (c.first().content == guild.roles.cache.find(role => role.name == "@everyone").id) {
                    return schannel.send("Please mention or paste the ID of a different role.")
                }
                else if (c.first().content.mentions != undefined) {
                    if (c.first().content.mentions.id == guild.roles.cache.find(role => role.name == "@everyone").id) {
                        return schannel.send("Please mention or paste the ID of a different role.")
                    }
                    var write1 = c.first().content.mentions.roles.first().id
                }
                else if (!isNaN(Number(c.first().content))) {
                    var write1 = c.first().content
                }
                else {
                    return schannel.send("Please mention or paste the ID of a valid role.")
                }
                schannel.send("Please mention or paste the ID of a role to set **Level 2** permissions for it.")
                while (setup == true) {
                    await schannel.awaitMessages(m => m.member.permissions.any("ADMINISTRATOR") == true, { max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        if (setup == false) {
                            return false
                        }
                        if (c.first().author.bot || c.first().system) {
                            return true
                        }
                        else if (write1 == write2 || c.first().content == guild.roles.cache.find(role => role.name == "@everyone").id) {
                            return schannel.send("Please mention or paste the ID of a different role.")
                        }
                        else if (c.first().content.mentions != undefined) {
                            if (c.first().content.mentions.id == guild.roles.cache.find(role => role.name == "@everyone").id) {
                                return schannel.send("Please mention or paste the ID of a different role.")
                            }
                            var write2 = c.first().content.mentions.roles.first().id
                        }
                        else if (!isNaN(Number(c.first().content))) {
                            var write2 = c.first().content
                        }
                        else {
                            return schannel.send("Please mention or paste the ID of a valid role.")
                        }
                        await mongoClient.connect()
                        await mongoClient.db("Servers").collection("Permissions").insertOne({server: message.guild.id, level1: write1, level2: write2})
                        mongoClient.close()
                        global.PermissionsCheck.push(guild.id)
                        fs.writeFile('./data/prefixes.json', JSON.stringify(prefixes).replace("}", `,"${guild.id}":"?"}`), function (err) {
                            schannel.send("I'm all set up!\nUse \`?help\` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#3435.")
                            return setup = false;
                        })
                    })
                }
            })
        }
    }
    else {
        schannel.send(`Thank you for inviting me.\nUse \`${prefix}help\` to get a list of all commands.\nI am still in development, so please DM any concerns to Cuno#3435.`)
    }
}

//User details updated
events.userUpdate = async (client, oldUser, newUser) => {
    if (oldUser.username == newUser.username && oldUser.avatar == newUser.avatar && oldUser.discriminator == newUser.discriminator) return;
    await mongoClient.connect()
    oldUser.client.guilds.cache.each(async (guild) => {
        var gm = guild.member(newUser)
        if (gm != null) {
            var check = await mongoClient.db("Servers").collection("Logging").findOne({server: gm.guild.id})
            if (check != undefined && gm.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
                if (oldUser.username != newUser.username) {
                    return gm.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Name change")
                        .setDescription(`**Before**: ${oldUser.username}\n**After:** ${newUser.username}`)
                    )
                }
                else if (oldUser.avatar != newUser.avatar) {
                    return gm.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Avatar updated")
                        .setThumbnail(newUser.avatarURL())
                        .setDescription(`<@${newUser.id}>`)
                    )
                }
                else if (oldUser.discriminator != newUser.discriminator) {
                    return gm.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Discriminator change")
                        .setDescription(`**Before**: ${oldUser.discriminator}\n**After:** ${newUser.discriminator}`)
                    )
                }
            }
        }
    })
    mongoClient.close()
}

//Guild member details updated
events.guildMemberUpdate = async (client, oldMember, newMember) => {
    if (oldMember.nickname == newMember.nickname) return;
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: newMember.guild.id})
    mongoClient.close()
    if (check != undefined && newMember.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        if (oldMember.nickname != newMember.nickname) {
            newMember.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("normal")
                .setAuthor(`${newMember.user.tag}`, newMember.user.avatarURL({format: 'png', dynamic: true}))
                .setTitle("Nickname change")
                .setDescription(`**Before**: ${oldMember.nickname == null ? "" : oldMember.nickname}\n**After:** ${newMember.nickname == null ? "" : newMember.nickname}`)
            )
        }
    }
}

//Guild member joined
events.guildMemberAdd = async (client, member) => {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: member.guild.id})
    mongoClient.close()
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
    if (check != undefined && member.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        member.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("success")
            .setAuthor(`${member.user.tag}`, member.user.avatarURL({format: 'png', dynamic: true}))
            .setTitle("Member joined")
            .setDescription(`<@${member.user.id}> is the ${users} member to join.`)
        )
    }
}

//Guild member left/kicked
events.guildMemberRemove = async (client, member) => {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: member.guild.id})
    mongoClient.close()
    if (check != undefined && member.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && member.id != "660856814610677761") {
        member.guild.channels.resolve(check["channel"]).send(f.BasicEmbed("RED")
            .setAuthor(`${member.user.tag}`, member.user.avatarURL({format: 'png', dynamic: true}))
            .setTitle("Member left")
            .setDescription(`<@${member.user.id}> joined ${dateFormat(member.joinedTimestamp, "longDate")}.\n**Roles:** ${member.roles.cache.array().join(", ")}`)
        )
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

module.exports = events