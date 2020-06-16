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
            case "665580974364557322":
                var level2 = role.mcwbureaucrat
                var level1 = role.mcwadministrator
                break
            case "660857785566887976":
                var level2 = role.cbtestrole
                break
            case "671923682205237278":
                var level2 = role.puadmin
                var level1 = role.pumoderator
                break
            case "676158184595128332":
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