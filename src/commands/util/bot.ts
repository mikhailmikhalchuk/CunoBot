import Discord from 'discord.js'
import dateFormat from 'dateformat';
import moment from "moment";
import { SlashCommandBuilder } from '@discordjs/builders';
var timeup = dateFormat(new Date(), 'mmmm d, yyyy "at" h:MM:ss TT')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Gets information about the bot'),
    async execute(interaction: Discord.CommandInteraction) {
        interaction.reply({embeds: [global.Functions.BasicEmbed("normal")
            .setAuthor("CunoBot", "https://cdn.discordapp.com/attachments/660857785566887979/662058292520157227/discorddefaultavatar.png")
            .addField("Owner", "<@287372868814372885>", true)
            .addField("Servers", global.Client.guilds.cache.size.toString(), true)
            .addField("Commands", global.Commands.size.toString(), true)
            .addField("Uptime", `${moment.duration(global.Client.uptime).format(" D [days], H [hrs], m [mins], s [secs]")} (since ${timeup})`, true)
            .addField("Repository", "https://github.com/MikhailMCraft/CunoBot", true)
            .addField("Server", "https://discord.gg/JWgtHHy", true)]}
        )
    }
}