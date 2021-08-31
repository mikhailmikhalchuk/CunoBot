import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updates')
        .setDescription('Grants or revokes the Bot Updates role'),
    async execute(interaction: Discord.CommandInteraction) {
        if ((interaction.member as Discord.GuildMember).roles.cache.find(role => role.id === "722555137511653398") == undefined) {
            (interaction.member as Discord.GuildMember).roles.add("722555137511653398")
            interaction.reply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully added the Bot Updates role.")], ephemeral: true})
        }
        else if ((interaction.member as Discord.GuildMember).roles.cache.find(role => role.id === "722555137511653398") != undefined) {
            (interaction.member as Discord.GuildMember).roles.remove("722555137511653398")
            interaction.reply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully removed the Bot Updates role.")], ephemeral: true})
        }
    }
}