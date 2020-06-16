const Discord = require('discord.js')
const role = require('./data/roles.json');
const prefixes = require('./data/prefixes.json');
var functions = {}

//Returns integer string used for calculating member permissions
functions.getUserLevel = (guild, member) => {
    if (member.id == "287372868814372885") {
        return 3
    }
    else if (member.user.bot) {
        return -1
    }
    else {
        switch (guild) {
            case "665580974364557322":
                if (member.roles.cache.has(role.mcwbureaucrat)) return 2
                else if (member.roles.cache.has(role.mcwadministrator)) return 1
            case "660857785566887976":
                if (member.roles.cache.has(role.cbtestrole)) return 2
            case "671923682205237278":
                if (member.roles.cache.has(role.puadmin)) return 2
                else if (member.roles.cache.has(role.pumoderator)) return 1
            case "676158184595128332":
                if (member.roles.cache.has(role.bdadmin)) return 2
                else if (member.roles.cache.has(role.bdmoderator)) return 1
            default:
                return 0
        }
    }
}

//Returns the prefix of the server a command was executed in
functions.getServerPrefix = (guild) => {
    if (prefixes[guild] != undefined) return prefixes[guild]
    else return "?"
}

//Makes commands non-functional on servers where that is requested
functions.commandServerHidden = (guild, name) => {
    if (guild.id == "671923682205237278") {
        if (name == "purge") {
            return true
        }
    }
}

//Takes a level and returns a string describing the level.
functions.levelToString = (guild, level) => {
    switch (guild) {
        case "665580974364557322":
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [1]: "Administrator",
                [2]: "Bureaucrat",
                [3]: "Bot Owner"
            }
            return levelStrings[level]
        case "660857785566887976":
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [2]: "Test Role",
                [3]: "Bot Owner"
            }
            return levelStrings[level]
        case "671923682205237278":
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [1]: "Moderator",
                [2]: "Administrator",
                [3]: "Bot Owner"
            }
            return levelStrings[level]
        case "676158184595128332":
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [1]: "Moderator",
                [2]: "Administrator",
                [3]: "Bot Owner"
            }
        default:
            var levelStrings = {
                [-1]: "Error",
                [0]: "Error",
                [1]: "Error",
                [2]: "Error",
                [3]: "Error"
            }
            return levelStrings[level]
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

//Capitalize
functions.capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
        const nicklist = message.guild.members.cache.filter(m => m.displayName.toLowerCase().slice(0, str.length) == str.toLowerCase())
        const userlist = message.guild.members.cache.filter(m => m.user.username.toLowerCase().slice(0, str.length) == str.toLowerCase())
        const exactMatchNick = nicklist.find(m => m.displayName.toLowerCase() == str.toLowerCase())
        const exactMatchUser = userlist.find(m => m.user.username.toLowerCase() == str.toLowerCase())
        if (exactMatchNick) {
            return [true, exactMatchNick]
        }
        if (exactMatchUser) {
            return [true, exactMatchUser]
        }
        else if (nicklist.size > 1) {
            var members = []
            for (var member in nicklist.array()) {
                if (member > 10) {
                    members.push(`+${nicklist.array().length - 10} more`)
                    break
                }
                members.push(nicklist.array()[member].displayName)
            }
            return [false, `Mulitple users found: ${members.join(", ")}`]
        }
        else if (nicklist.size == 1) {
            return [true, nicklist.first()]
        }
        else if (userlist.size > 1) {
            var members = []
            for (var member in userlist.array()) {
                if (member > 10) {
                    members.push(`+${userlist.array().length - 10} more`)
                    break
                }
                members.push(userlist.array()[member].user.username)
            }
            return [false, `Mulitple users found: ${members.join(", ")}`]
        }
        else if (userlist.size == 1) {
            return [true, userlist.first()]
        }
    }
    return [false, "No user found!"]
}

//Grabs embed from Discord
functions.embed = () => {
    return new Discord.MessageEmbed()
}

module.exports = functions