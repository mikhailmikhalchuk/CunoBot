const dateFormat = require('dateformat');

module.exports = {
    name: "server",
    aliases: ["guild"],
    desc: "Gets information about this server.",
    level: "0",
    func: async (message) => {
        //Make sure bot is checking the server command was executed in
        const guild = message.guild
        //Distinguish from bots/humans
        const [bots, humans] = guild.members.cache.partition(member => member.user.bot == true)
        //Grab number of text channels
        const textChannels = guild.channels.cache.filter(channel => channel.type == "text")
        //Grab number of voice channels
        const voiceChannels = guild.channels.cache.filter(channel => channel.type == "voice")
        //Embed creation
        message.channel.send(global.Functions.BasicEmbed("normal")
            .setAuthor(guild.name, guild.iconURL({format: 'png', dynamic: true}))
            .addField("Owner", guild.owner, true)
            .addField("Server Creation", dateFormat(guild.createdAt, "UTC: mmmm dS, yyyy"), true)
            .addField("Region", guild.region, true)
            .addField("Members", guild.memberCount, true)
            .addField("Humans", humans.size, true)
            .addField("Bots", bots.size, true)
            .addField("Text Channels", textChannels.size, true)
            .addField("Voice Channels", voiceChannels.size, true))
    }
}