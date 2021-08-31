import auth from './data/auth.json';
import Discord, { Message, TextChannel, Client, GuildChannel, GuildEmoji } from 'discord.js';
const mongodb = require('mongodb')
const mongoClient = new mongodb.MongoClient(auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
const dateFormat = require('dateformat');
import * as f from './functions'

//Message Deleted
export async function messageDelete (client: Client, message: Message) {
    if (message.channel.type == "DM") return;
    await mongoClient.connect()
    var check = await mongoClient.db("Servers").collection("Logging").findOne({server: message.guild.id})
    mongoClient.close()
    if (check != undefined && check["ignored"] == undefined) check["ignored"] = [];
    if (check != undefined && message.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && !message.author.bot && !check["ignored"].toString().includes(message.channel.id) && !message.webhookId && !message.system) {
        if (message.attachments.size > 0) {
            var attachment = message.attachments.first()
            return (message.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("RED")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`)
                .addField("Attachments", attachment.url)]}
            )
        }
        return (message.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("RED")
            .setAuthor(`${message.author.tag}`, message.author.avatarURL({format: 'png', dynamic: true}))
            .setDescription(`**Message sent by <@${message.member.id}> deleted in <#${message.channel.id}>**\n${message.content}`)]}
        )
    }
}

//Bulk message deletion
export async function messageDeleteBulk (client: Client, messages: Discord.Collection<Discord.Snowflake, Message>) {
    await mongoClient.connect()
    var check = await mongoClient.db("Servers").collection("Logging").findOne({server: messages.first().guild.id})
    mongoClient.close()
    if (check != undefined && check["ignored"] == undefined) check["ignored"] = [];
    var data = messages.first().guild
    let logs = await data.fetchAuditLogs({type: 73})
    let entry = logs.entries.first()
    if (check != undefined && data.channels.resolve(check["channel"]) != undefined && check["status"] == true && entry.executor.id != "660856814610677761" && !check["ignored"].toString().includes(messages.first().channel.id)) {
        return (data.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("RED")
            .setAuthor(data.name, data.iconURL({format: 'png', dynamic: true}))
            .setDescription(`**Bulk deletion in <#${messages.first().channel.id}>**\n${messages.size} messages deleted.`)]}
        )
    }
}

//Message Updated
export async function messageUpdate (client: Client, oldMessage: Message, newMessage: Message) {
    if (oldMessage.channel.type == "DM" || newMessage.embeds.length != 0 || oldMessage.embeds.length != newMessage.embeds.length || newMessage.pinned != oldMessage.pinned) return;
    await mongoClient.connect()
    var check = await mongoClient.db("Servers").collection("Logging").findOne({server: oldMessage.guild.id})
    mongoClient.close()
    if (check != undefined && check["ignored"] == undefined) check["ignored"] = [];
    else if (check != undefined && oldMessage.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && !oldMessage.author.bot && !check["ignored"].toString().includes(oldMessage.channel.id) && !oldMessage.webhookId) {
        if (oldMessage.attachments.size > 0) {
            var attachment = oldMessage.attachments.first()
            return (oldMessage.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
                .setAuthor(`${oldMessage.author.tag}`, oldMessage.author.avatarURL({format: 'png', dynamic: true}))
                .setDescription(`**Message sent by <@${oldMessage.member.id}> edited in <#${oldMessage.channel.id}>**\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`)
                .addField("Attachments", attachment.url)]}
            )
        }
        return (oldMessage.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
            .setAuthor(`${oldMessage.author.tag}`, oldMessage.author.avatarURL({format: 'png', dynamic: true}))
            .setDescription(`**Message sent by <@${oldMessage.member.id}> edited in <#${oldMessage.channel.id}>**\n**Before:** ${oldMessage.content}\n**After:** ${newMessage.content}`)]}
        )
    }
}

//Emoji Added
export async function emojiCreate (client: Client, emoji: GuildEmoji) {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: emoji.guild.id})
    mongoClient.close()
    if (check != undefined && emoji.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        if (emoji.animated == false) {
            return (emoji.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("success")
                .setAuthor("Emoji created")
                .setDescription(`<:${emoji.name}:${emoji.id}> ${emoji.name}`)]}
            )
        }
        return (emoji.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("success")
            .setAuthor("Emoji created")
            .setDescription(`<a:${emoji.name}:${emoji.id}> ${emoji.name}`)]}
        )
    }
}

//Emoji Deleted
export async function emojiDelete (client: Client, emoji: GuildEmoji) {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: emoji.guild.id})
    mongoClient.close()
    if (check != undefined && emoji.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        (emoji.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("RED")
            .setAuthor("Emoji deleted")
            .setDescription(emoji.name)]}
        )
    }
}

//Emoji Updated
export async function emojiUpdate (client: Client, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: oldEmoji.guild.id})
    mongoClient.close()
    if (check != undefined && oldEmoji.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        if (newEmoji.animated == false) {
            return (oldEmoji.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
                .setAuthor("Emoji updated")
                .setDescription(`<:${oldEmoji.name}:${oldEmoji.id}> ${oldEmoji.name} -> <:${newEmoji.name}:${newEmoji.id}> ${newEmoji.name}`)]}
            )
        }
        (oldEmoji.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
                .setAuthor("Emoji updated")
                .setDescription(`<a:${oldEmoji.name}:${oldEmoji.id}> ${oldEmoji.name} -> <a:${newEmoji.name}:${newEmoji.id}> ${newEmoji.name}`)]}
            )
    }
}

//Category/channel created
export async function channelCreate (client: Client, channel: GuildChannel) {
    if ((channel as Discord.Channel).type == "DM") return;
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: channel.guild.id})
    mongoClient.close()
    if (check != undefined && channel.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        (channel.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("success")
            .setAuthor(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}${channel.type == "GUILD_CATEGORY" ? "" : " channel"} created`)
            .setDescription(`**Name:** ${channel.name}${channel.type != "GUILD_CATEGORY" ? `\n**Category:** ${channel.parent == null ? "None" : channel.parent.name}` : ""}`)]}
        )
    }
}

//Category/channel deleted
export async function channelDelete (client: Client, channel: GuildChannel) {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: channel.guild.id})
    mongoClient.close()
    if (check != undefined && channel.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        (channel.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("RED")
            .setAuthor(`${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}${channel.type == "GUILD_CATEGORY" ? "" : " channel"} deleted`)
            .setDescription(`**Name:** ${channel.name}${channel.type != "GUILD_CATEGORY" ? `\n**Category:** ${channel.parent == null ? "None" : channel.parent.name}` : ""}`)]}
        )
    }
}

//Category/channel updated
export async function channelUpdate (client: Client, oldChannel: GuildChannel, newChannel: GuildChannel) {
    if ((oldChannel as TextChannel).topic == (newChannel as TextChannel).topic && oldChannel.name == newChannel.name && oldChannel.parent == newChannel.parent) return;
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: oldChannel.guild.id})
    mongoClient.close()
    if (check != undefined && oldChannel.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        return (oldChannel.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
            .setAuthor(`${oldChannel.type.charAt(0).toUpperCase() + oldChannel.type.slice(1)}${oldChannel.type == "GUILD_CATEGORY" ? "" : " channel"} ${oldChannel.parent != newChannel.parent ? "moved" : "updated"}`)
            .setFooter(`Channel ID: ${newChannel.id}`)
            .addField("Before:", `${oldChannel.name != newChannel.name ? `**Name:** ${oldChannel.name}` : ""}${(oldChannel as TextChannel).topic != (newChannel as TextChannel).topic ? (oldChannel as TextChannel).topic == null ? "\n**Topic:** " : `\n**Topic:** ${(oldChannel as TextChannel).topic}` : ""}${oldChannel.parent != newChannel.parent ? `**Category:** ${oldChannel.parent == null ? "None" : oldChannel.parent.name.charAt(0).toUpperCase() + oldChannel.parent.name.slice(1)}` : ""}`, true)
            .addField("After:", `${oldChannel.name != newChannel.name ? `**Name:** ${newChannel.name}` : ""}${(oldChannel as TextChannel).topic != (newChannel as TextChannel).topic ? `\n**Topic:** ${(newChannel as TextChannel).topic}` : ""}${oldChannel.parent != newChannel.parent ? `**Category:** ${newChannel.parent == null ? "None" : newChannel.parent.name.charAt(0).toUpperCase() + newChannel.parent.name.slice(1)}` : ""}`, true)]}
        )
    }
}

//Guild join logger
export async function guildCreate (client: Client, guild: Discord.Guild) {
    var schannel = (guild.channels.cache.find(text => text.type === "GUILD_TEXT") as TextChannel)
    if (guild.me.permissions.any("SEND_MESSAGES") == false) {
        guild.leave()
        return;
    }
    if (guild.me.permissions.any("ADMINISTRATOR") == false) {
        schannel.send({embeds: [f.BasicEmbed(("normal"), "It seems I do not have administrative permissions in this server.\nI am unable to function correctly without them.\nTry re-inviting me using [this link](https://discord.com/api/oauth2/authorize?client_id=660856814610677761&permissions=8&scope=bot).")]})
        guild.leave()
        return;
    }
    return schannel.send(`Thank you for inviting me.\nI am still in development, so please DM any concerns to Cuno#9958.`);
}

//User details updated
export async function userUpdate (client: Client, oldUser: Discord.User, newUser: Discord.User) {
    if (oldUser.username == newUser.username && oldUser.avatar == newUser.avatar && oldUser.discriminator == newUser.discriminator) return;
    oldUser.client.guilds.cache.each(async (guild) => {
        var gm = guild.members.cache.get(newUser.username)
        if (gm != null) {
            await mongoClient.connect()
            var check = await mongoClient.db("Servers").collection("Logging").findOne({server: gm.guild.id})
            mongoClient.close()
            if (check != undefined && gm.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
                if (oldUser.username != newUser.username) {
                    return (gm.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Name change")
                        .setDescription(`**Before**: ${oldUser.username}\n**After:** ${newUser.username}`)]}
                    )
                }
                else if (oldUser.avatar != newUser.avatar) {
                    return (gm.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Avatar updated")
                        .setThumbnail(newUser.avatarURL())
                        .setDescription(`<@${newUser.id}>`)]}
                    )
                }
                else if (oldUser.discriminator != newUser.discriminator) {
                    return (gm.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
                        .setAuthor(`${newUser.tag}`, newUser.avatarURL({format: 'png', dynamic: true}))
                        .setTitle("Discriminator change")
                        .setDescription(`**Before**: ${oldUser.discriminator}\n**After:** ${newUser.discriminator}`)]}
                    )
                }
            }
        }
    })
}

//Guild member details updated
export async function guildMemberUpdate (client: Client, oldMember: Discord.GuildMember, newMember: Discord.GuildMember) {
    if (oldMember.nickname == newMember.nickname) return;
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: newMember.guild.id})
    mongoClient.close()
    if (check != undefined && newMember.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        if (oldMember.nickname != newMember.nickname) {
            (newMember.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("normal")
                .setAuthor(`${newMember.user.tag}`, newMember.user.avatarURL({format: 'png', dynamic: true}))
                .setTitle("Nickname change")
                .setDescription(`**Before**: ${oldMember.nickname == null ? "" : oldMember.nickname}\n**After:** ${newMember.nickname == null ? "" : newMember.nickname}`)]}
            )
        }
    }
}

//Guild member joined
export async function guildMemberAdd (client: Client, member: Discord.GuildMember) {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: member.guild.id})
    mongoClient.close()
    var users = member.guild.memberCount
    var suffix
    var j = users % 10, k = users % 100
    if (j == 1 && k != 11) {
        suffix = "st"
    }
    else if (j == 2 && k != 12) {
        suffix = "nd"
    }
    else if (j == 3 && k != 13) {
        suffix = "rd"
    }
    else {
        suffix = "th"
    }
    if (check != undefined && member.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true) {
        (member.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("success")
            .setAuthor(`${member.user.tag}`, member.user.avatarURL({format: 'png', dynamic: true}))
            .setTitle("Member joined")
            .setDescription(`<@${member.user.id}> is the ${users}${suffix} member to join.`)]}
        )
    }
}

//Guild member left/kicked
export async function guildMemberRemove (client: Client, member: Discord.GuildMember) {
    await mongoClient.connect()
    const check = await mongoClient.db("Servers").collection("Logging").findOne({server: member.guild.id})
    mongoClient.close()
    if (check != undefined && member.guild.channels.resolve(check["channel"]) != undefined && check["status"] == true && member.id != "660856814610677761") {
        var members: string[] = [];
        member.roles.cache.forEach((role) => {
            members.push(role.name);
        });
        (member.guild.channels.resolve(check["channel"]) as TextChannel).send({embeds: [f.BasicEmbed("RED")
            .setAuthor(`${member.user.tag}`, member.user.avatarURL({format: 'png', dynamic: true}))
            .setTitle("Member left")
            .setDescription(`<@${member.user.id}> joined ${dateFormat(member.joinedTimestamp, "longDate")}.\n**Roles:** ${members.join(", ")}`)]}
        )
    }
}

//Bot session invalidated
export function invalidated () {
    const d = new Date()
    console.log(`Bot has disconnected.\nSession invalidated at ${dateFormat(d, "h:MM:ss TT")}.`)
    process.exit(0)
}

//Bot error encountered
export function error (error: Error) {
    console.error(error)
}

//Bot warning encountered
export function warn (info: string) {
    console.warn(info)
}