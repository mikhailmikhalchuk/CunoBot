const regex = /<(a?):(.*?):(.*?)>/i
import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription("Takes and emoji and returns its image, as well as some data")
        .addStringOption(option => option.setName('emoji').setDescription('The emoji to gather data on').setRequired(true)),
    async execute(interaction: Discord.CommandInteraction) {
        const groups = regex.exec(interaction.options.getString('emoji'))
        if (groups) {
            const id = groups[3]
            return interaction.reply({embeds: [global.Functions.BasicEmbed('normal', ' ')
                .setTitle("Emoji")
                .addField("Name", groups[2], true)
                .addField("ID", id, true)
                .setImage(`https://cdn.discordapp.com/emojis/${id}.${groups[1] == "a" ? "gif" : "png"}`)]})
        }
        return interaction.reply({embeds: [global.Functions.BasicEmbed('error', "Emoji not found. This command only works for custom emojis.")]})
    }
}