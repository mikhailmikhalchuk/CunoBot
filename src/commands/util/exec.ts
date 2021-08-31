import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
const dateFormat = require('dateformat');
var disabled = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exec')
        .setDescription('Executes JavaScript code from the bot')
        .addStringOption(option => option.setName('code').setDescription('The code to execute'))
        .setDefaultPermission(false),
    async execute(interaction: Discord.CommandInteraction) {
        try {
            if (disabled == true) {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "The command is currently disabled.")], ephemeral: true})
            }
            else if (interaction.options.getString('code').match(/auth\./gi) && disabled == false) {
                disabled = true
                const d = new Date()
                console.log(`ALERT | ATTEMPTED ACCESS OF SENSITIVE DATA\n----\nby: ${(interaction.member.user as Discord.User).tag}\nin: ${interaction.guild.name}\non: ${dateFormat(d, 'mmmm d, yyyy "at" h:MM:ss TT')}\nchannel: #${(interaction.channel as Discord.TextChannel).name}\ncontent: \"${interaction.options.getString('code')}\"\n----\nEXEC COMMAND HAS BEEN DISABLED`)
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "The command has been disabled due to an attempted access of sensitive data.")], ephemeral: true})
            }
            eval(interaction.options.getString('code'))
        }
        catch {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Could not run JavaScript. Check your code and try again.")], ephemeral: true})
        }
    }
}