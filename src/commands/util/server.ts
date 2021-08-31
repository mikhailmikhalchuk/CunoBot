import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
const dateFormat = require('dateformat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Gets information about this server'),
    async execute(interaction: Discord.CommandInteraction) {
        var roleSize = 0
        const guild = interaction.guild
        const [bots, humans] = guild.members.cache.partition(member => member.user.bot == true)
        const owner = await guild.fetchOwner()
        guild.roles.cache.forEach(() => roleSize = roleSize + 1)
        interaction.reply({embeds: [global.Functions.BasicEmbed("normal")
            .setAuthor(guild.name, guild.iconURL({format: 'png', dynamic: true}))
            .addField("Owner", owner.user.username, true)
            .addField("Server Creation", dateFormat(guild.createdAt, "UTC: mmmm dS, yyyy"), true)
            .addField("Members", guild.memberCount.toString(), true)
            .addField("Humans", humans.size.toString(), true)
            .addField("Bots", bots.size.toString(), true)
            .addField("Text Channels", guild.channels.cache.filter(channel => channel.type == 'GUILD_TEXT').size.toString(), true)
            .addField("Voice Channels", guild.channels.cache.filter(channel => channel.type == 'GUILD_VOICE').size.toString(), true)
            .addField("Roles", roleSize.toString(), true)
            .addField("Perks", `${guild.partnered == true ? "<:partnered:811309058833383446>" : ""}${guild.verified == true ? "<:verified:811310553577947216>" : ""}${guild.premiumTier != 'NONE' ? `<:boost:811311024506011699> Level ${guild.premiumTier}` : ""} ${guild.partnered == false && guild.verified == false && guild.premiumTier == 'NONE' ? "None" : ""}`)]})
    }
}