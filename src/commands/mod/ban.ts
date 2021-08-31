import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user')
        .addMentionableOption(option => option.setName('member').setDescription('The member to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for banning the user'))
        .setDefaultPermission(false),
    async execute(interaction: Discord.CommandInteraction) {
        const member = interaction.options.getMentionable('member')
        const res = interaction.options.getString('reason')
        if ((interaction.member as Discord.GuildMember).roles.highest.position <= (member as Discord.GuildMember).roles.highest.position && interaction.user.id != interaction.guild.ownerId) {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Cannot ban users ranked the same or higher than you.")]})
        }
        (member as Discord.GuildMember).ban({reason: res ?? "No reason provided"}).then((d) => {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully banned user.")]})
        })
        .catch((e) => {
            if (e.message == "Missing Permissions") {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Do not have permissions to ban this user.")]})
            }
        })
    }
}