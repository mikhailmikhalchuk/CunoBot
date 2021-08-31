import Discord from 'discord.js'
import fs from 'fs';
import dateFormat from 'dateformat';
import { SlashCommandBuilder } from '@discordjs/builders';
const userCooldown: any = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription("Adds a report to the bot's bug list. Do not abuse this command")
        .addStringOption(option => option.setName('info').setDescription('The information to report')),
    async execute(interaction: Discord.CommandInteraction) {
        const info = interaction.options.getString('info')
        if (userCooldown[interaction.user.id] == false || userCooldown[interaction.user.id] == undefined || await global.Functions.getUserLevel(interaction.guild, (interaction.member as Discord.GuildMember)) == 3) {
            userCooldown[interaction.user.id] = true;
            await interaction.reply({content: "Adding to list...", ephemeral: true})
            const d = new Date();
            fs.appendFile('reports.txt', `New report by ${(interaction.member as Discord.GuildMember).user.tag} (id: ${(interaction.member as Discord.GuildMember).id}) from ${interaction.guild.name} (id: ${interaction.guild.id}) on ${dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')}: ${info}\n`, async function (err: Error) {
                if (err) return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), err)]})
                await interaction.editReply("Successfully added your report to the bug list.")
            })
            setTimeout(() => {userCooldown[interaction.user.id] = false}, 600000)
        }
        else if (userCooldown[interaction.user.id] == true) {
            interaction.reply({content: "You must wait 10 minutes before using this command again!", ephemeral: true})
        }
    }
}