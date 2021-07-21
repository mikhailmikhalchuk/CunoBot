import Discord from 'discord.js'
const dateFormat = require('dateformat');
const moment = require("moment"); require("moment-duration-format");
var d = new Date();
var timeup = dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')

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
        )
    }
}