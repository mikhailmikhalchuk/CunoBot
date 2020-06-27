const Discord = require('discord.js')
const roles = require('./data/roles.json');
const functions = {}

//Returns integer string used for calculating member permissions
functions.getUserLevel = (guild, member) => {
    if (member.id == "287372868814372885") {
        return 3
    }
    else if (member.user.bot) {
        return -1
    }
    if (member.roles.cache.has(roles[`${guild}level1`])) {
        return 1
    }
    else if (member.roles.cache.has(roles[`${guild}level2`])) {
        return 2
    }
    return 0
}

//Makes commands non-functional on servers where that is requested
functions.commandServerHidden = (guild, name) => {
    if (guild.id == "671923682205237278") {
        if (name == "purge") {
            return true
        }
    }
}

//Check if the command being requested exists
functions.commandMatch = (commandData, str) => {
    if (commandData.name == str) {
        return true
    }
    for (var alias in commandData.aliases) {
        if (commandData.aliases[alias] == str) {
            return true
        }
    }
    return false
}

//Creates embed color
functions.BasicEmbed = (type, text, options) => {
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
functions.getMember = (message, str) => {
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
            for (var member in nickList.array()) {
                if (member > 10) {
                    members.push(`+${nickList.array().length - 10} more`)
                    break
                }
                members.push(nickList.array()[member].displayName)
            }
            return [false, `Mulitple users found: ${members.join(", ")}`]
        }
        else if (nickList.size == 1) {
            return [true, nickList.first()]
        }
        else if (userList.size > 1) {
            var members = []
            for (var member in userList.array()) {
                if (member > 10) {
                    members.push(`+${userList.array().length - 10} more`)
                    break
                }
                members.push(userList.array()[member].user.username)
            }
            return [false, `Mulitple users found: ${members.join(", ")}`]
        }
        else if (userList.size == 1) {
            return [true, userList.first()]
        }
    }
    return [false, "No user found!"]
}

module.exports = functions