const mongodb = require('mongodb');
const auth = require('./data/auth.json');
import Discord from "discord.js"
const mongoClient = new mongodb.MongoClient(auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });

//Returns integer string used for calculating member permissions
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

export function BasicEmbed (type: string, text?: any, options?: string[]) {
    if (typeof type == "object") options = type
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
        embed = embed.setColor(type)
    }
    else {
        embed = embed.setColor('DEFAULT')
    }
    return embed
}

//Grabs a user by their full or partial name or nickname (or a mention)
export function getMember (message: Discord.Message, str: string) {
    var member = message.mentions.members.first()
    if (member) {
        return [true, member]
    }
    else {
        if (str == undefined || str == "") {
            return [true, message.member]
        }
        const nickList = message.guild.members.cache.filter(m => m.displayName.toLowerCase().slice(0, str.length) == str.toLowerCase())
        const userList = message.guild.members.cache.filter(m => m.user.username.toLowerCase().slice(0, str.length) == str.toLowerCase())
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
            for (var memberCheck in nickList.array()) {
                if (Number(memberCheck) > 10) {
                    members.push(`+${nickList.array().length - 10} more`)
                    break
                }
                members.push(nickList.array()[memberCheck].displayName)
            }
            return [false, `Mulitple users found: ${members.join(", ")}`]
        }
        else if (nickList.size == 1) {
            return [true, nickList.first()]
        }
        else if (userList.size > 1) {
            var members = []
            for (var memberCheck in userList.array()) {
                if (Number(memberCheck) > 10) {
                    members.push(`+${userList.array().length - 10} more`)
                    break
                }
                members.push(userList.array()[memberCheck].user.username)
            }
            return [false, `Mulitple users found: ${members.join(", ")}`]
        }
        else if (userList.size == 1) {
            return [true, userList.first()]
        }
    }
    return [false, "No user found!"]
}