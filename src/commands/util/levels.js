const server = require('C:/Users/Cuno/Documents/DiscordBot/src/data/guilds.json');
const role = require('C:/Users/Cuno/Documents/DiscordBot/src/data/roles.json');

module.exports = {
    name: "levels",
    aliases: [],
    desc: "Lists the roles bound to the bot's level measurement.",
    level: "0",
    func: async (message, args) => {
        var level2 = ""
        var level1 = ""
        switch (message.guild.id) {
            case server.madcitywiki:
                var level2 = role.mcwbureaucrat
                var level1 = role.mcwadministrator
                break
            case server.cunobot:
                var level2 = role.cbtestrole
                break
            case server.paralleluniverse:
                var level2 = role.puadmin
                var level1 = role.pumoderator
                break
            case server.breaddimension:
                var level2 = role.bdadmin
                var level1 = role.bdmoderator
                break
            default:
                var level2 = "error"
                var level1 = "error"
                break
        }
        if (level1 == "") {
            message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Levels")
                .addField("Level 2", `<@&${level2}>`)
                .addField("Level 0", "@everyone")
                .addField("Your Level", `Level ${global.Functions.getUserLevel(message.guild.id, message.member)}`))
        }
        else {
            message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Levels")
                .addField("Level 2", `<@&${level2}>`)
                .addField("Level 1", `<@&${level1}>`)
                .addField("Level 0", "@everyone")
                .addField("Your Level", `Level ${global.Functions.getUserLevel(message.guild.id, message.member)}`))
        }
    }
}