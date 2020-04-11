const Discord = require('discord.js')
const role = require('./data/roles.json');
const server = require('./data/guilds.json');
var functions = {}

//Returns integer string used for calculating member permissions
functions.getUserLevel = (member) => {
    if (member.id == "287372868814372885") {
        return 3
    }
    else if (member.roles.cache.has(role.mcwbureaucrat) || member.roles.cache.has(role.cbtestrole) || member.roles.cache.has(role.puadmin) || member.roles.cache.has(role.bdadmin)) {
        return 2
    }
    else if (member.roles.cache.has(role.mcwadministrator) || member.roles.cache.has(role.pumoderator) || member.roles.cache.has(role.bdmoderator)) {
        return 1
    }
    else if (member.user.bot) {
        return -1
    }
    return 0
}

functions.unusedGuildWrite = () => {
    //Convert guilds.json to string
    var ssave = JSON.stringify(server)
    //Replace closing bracket with server name & ID plus closing bracket
    var ssave = ssave.replace("}", `,\"${guild.name.trim().toLowerCase()}\": \"${guild.id}\"\n}`)
    //Add line breaks and tabs to the end of all commas (converting to string eliminates all line breaks)
    var ssave = ssave.replace(/,/g, ",\n\t")
    //Replace opening bracket with opening bracket, line break & tab
    var ssave = ssave.replace("{", "{\n\t")
    //Write all this to guilds.json
    fs.writeFile('C:/Users/Cuno/Documents/DiscordBot/src/data/guilds.json', ssave, function (err) {
        if (err) message.channel.send(global.Functions.BasicEmbed(("error"), err))
    });
}

//Returns the prefix of the server a command was executed in
functions.getServerPrefix = (guild) => {
    switch (guild) {
        case server.madcitywiki:
            return "?"
        case server.cunobot:
            return "?"
        case server.paralleluniverse:
            return "."
        case server.breaddimension:
            return "."
    }
}

//Makes commands non-functional on servers where that is requested
functions.commandServerHidden = (guild, name) => {
    if (guild == server.paralleluniverse) {
        if (name == "purge") {
            return true
        }
    }
}

//Takes a level and returns a string describing the level.
functions.levelToString = (guild, level) => {
    //Mad City Wiki
    switch (guild) {
        case server.madcitywiki:
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [1]: "Administrator",
                [2]: "Bureaucrat",
                [3]: "Bot Owner"
            }
            return levelStrings[level]
        case server.cunobot:
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [2]: "Test Role",
                [3]: "Bot Owner"
            }
            return levelStrings[level]
        case server.paralleluniverse:
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [1]: "Moderator",
                [2]: "Administrator",
                [3]: "Bot Owner"
            }
            return levelStrings[level]
        case server.breaddimension:
            var levelStrings = {
                [-1]: "Bot",
                [0]: "Normal User",
                [1]: "Moderator",
                [2]: "Administrator",
                [3]: "Bot Owner"
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