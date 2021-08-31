const mongodb = require('mongodb');
const auth = require('./data/auth.json');
import Discord, { ColorResolvable } from "discord.js"
const mongoClient = new mongodb.MongoClient(auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });

/**
 * Gets a user's permission level and returns it in a promise.
 * @param guild The guild in which to get the member's permission level.
 * @param member The member in which to get the permission level of.
 */
export async function getUserLevel (guild: Discord.Guild, member: Discord.GuildMember) {
    var level1
    var level2
    global.PermissionsList.forEach((e: any[string]) => {
        if (e["server"] == guild.id) {
            level1 = e["level1"]
            level2 = e["level2"]
        }
    })
    if (member.id == "287372868814372885") {
        return 3
    }
    else if (member.user.bot) {
        return -1
    }
    else if (member.roles.cache.has(level2) || member.permissions.any("ADMINISTRATOR")) {
        return 2
    }
    else if (member.roles.cache.has(level1)) {
        return 1
    }
    return 0
}

/**
 * Constructs a `Discord.MessageEmbed` and returns it.
 * @param type The type of embed in which to return. Accepts `normal`, `success`, `error`, or any color.
 * @param text The text in which to set the description of the embed.
 */
export function BasicEmbed (type: string, text?: any) {
    var embed = new Discord.MessageEmbed()
        .setFooter("Cuno's Bot")
        .setTimestamp()
    if (text) {
        embed = embed.setDescription(text)
    }
    if (type == "normal") {
        embed = embed.setColor('BLUE')
    }
    else if (type == "success") {
        embed = embed.setColor('GREEN')
    }
    else if (type == "error") {
        embed = embed.setColor('RED')
        .setAuthor("Error")
    }
    else if (type) {
        embed = embed.setColor((type as ColorResolvable))
    }
    else {
        embed = embed.setColor('DEFAULT')
    }
    return embed;
}

/**
 * Gets a guild member based on name, nickname, or mention.
 * @param message The message which triggered the function.
 * @param str The string in which to search with.
 */
export function getMember (guild: Discord.Guild, str: string) {
    const nickList = guild.members.cache.filter(m => m.displayName.toLowerCase().slice(0, str.length) == str.toLowerCase())
    const userList = guild.members.cache.filter(m => m.user.username.toLowerCase().slice(0, str.length) == str.toLowerCase())
    const exactMatchNick = nickList.find(m => m.displayName.toLowerCase() == str.toLowerCase())
    const exactMatchUser = userList.find(m => m.user.username.toLowerCase() == str.toLowerCase())
    if (exactMatchNick) {
        return [true, exactMatchNick]
    }
    if (exactMatchUser) {
        return [true, exactMatchUser]
    }
    else if (nickList.size > 1) {
        var members = []
        for (var memberCheck in nickList) {
            if (Number(memberCheck) > 10) {
                members.push(`+${nickList.size - 10} more`)
                break
            }
            members.push(nickList.get(memberCheck).displayName)
        }
        return [false, `Mulitple users found: ${members.join(", ")}`]
    }
    else if (nickList.size == 1) {
        return [true, nickList.first()]
    }
    else if (userList.size > 1) {
        var members = []
        for (var memberCheck in userList) {
            if (Number(memberCheck) > 10) {
                members.push(`+${userList.size - 10} more`)
                break
            }
            members.push(userList.get(memberCheck).user.username)
        }
        return [false, `Mulitple users found: ${members.join(", ")}`]
    }
    else if (userList.size == 1) {
        return [true, userList.first()]
    }
    return [false, "No user found!"]
}