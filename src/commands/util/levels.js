const roles = require('C:/Users/Cuno/Documents/DiscordBot/src/data/roles.json');

module.exports = {
    name: "levels",
    aliases: [],
    desc: "Lists the roles bound to the bot's level measurement.",
    level: "0",
    func: async (message) => {
        var level1 = roles[`${message.guild.id}level1`] != undefined ? roles[`${message.guild.id}level1`] : ""
        var level2 = roles[`${message.guild.id}level2`] != undefined ? roles[`${message.guild.id}level2`] : ""
        if (level1 == "") {
            return message.channel.send(global.Functions.BasicEmbed("normal")
                .setAuthor("Levels")
                .addField("Level 2", `<@&${level2}>`)
                .addField("Level 0", "@everyone")
                .addField("Your Level", `Level ${global.Functions.getUserLevel(message.guild.id, message.member)}`))
        }
        message.channel.send(global.Functions.BasicEmbed("normal")
            .setAuthor("Levels")
            .addField("Level 2", `<@&${level2}>`)
            .addField("Level 1", `<@&${level1}>`)
            .addField("Level 0", "@everyone")
            .addField("Your Level", `Level ${global.Functions.getUserLevel(message.guild.id, message.member)}`))
    }
}