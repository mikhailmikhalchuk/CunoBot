import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
var bound = false

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bind')
        .setDescription('Binds the current channel to the DM')
        .setDefaultPermission(false),
    async execute(interaction: Discord.CommandInteraction) {
        if (bound == false) {
            global.List = [interaction.guild.id, interaction.channel.id]
            bound = true
            return interaction.reply({content: `Successfully bound to channel ID ${interaction.channel.id}. Message flow begins from this point onwards.`, ephemeral: true})
        }
        else {
            global.List = []
            bound = false
            return interaction.reply({content: `Successfully removed the bind from the current channel. Message flow has ended.`, ephemeral: true})
        }
    }
}