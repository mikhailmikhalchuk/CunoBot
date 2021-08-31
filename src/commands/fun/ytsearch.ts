import Discord from 'discord.js'
import youtubedl from 'youtube-dl'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ytsearch')
        .setDescription('Searches for a video on YouTube and returns the results')
        .addStringOption(option => option.setName('search').setDescription('The YouTube link to search for or keyword(s) to search with').setRequired(true)),
    async execute(interaction: Discord.CommandInteraction) {
        await interaction.reply("Searching...")
        await interaction.deferReply();
        youtubedl.getInfo(`ytsearch:${interaction.options.getString('search')}`, function (err: Error, info: any) {
            interaction.editReply(`Here's what I found:\nhttps://youtube.com/watch?v=${info.id}`)
        })
    }
}