import Discord from 'discord.js'
import dateFormat from 'dateformat';
import moment from "moment";
var timeup = dateFormat(new Date(), 'mmmm d, yyyy "at" h:MM:ss TT')

module.exports = {
    name: "bot",
    aliases: [],
    desc: "Gets information about the bot.",
    level: 0,
    func: async (message: Discord.Message) => {
        message.channel.send(global.Functions.BasicEmbed("normal")
            .setAuthor("CunoBot", "https://cdn.discordapp.com/attachments/660857785566887979/662058292520157227/discorddefaultavatar.png")
            .addField("Owner", "<@287372868814372885>", true)
            .addField("Servers", global.Client.guilds.cache.size, true)
            .addField("Commands", global.CommandCount, true)
            .addField("Uptime", `${moment.duration(global.Client.uptime).format(" D [days], H [hrs], m [mins], s [secs]")} (since ${timeup})`, true)
            .addField("Repository", "https://github.com/MikhailMCraft/CunoBot", true)
            .addField("Server", "https://discord.gg/JWgtHHy", true)
        )
    }
}