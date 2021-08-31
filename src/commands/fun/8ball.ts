var cachedRatings: any = {"dummy":"4"}
import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Has the bot rate the occurrence of something')
        .addStringOption(option => option.setName('message').setDescription('The message to rate').setRequired(true)),
    async execute(interaction: Discord.CommandInteraction) {
        const args = interaction.options.getString('message')
        if (cachedRatings[args] != undefined) {
            return interaction.reply(cachedRatings[args])
        }
        switch (Math.floor(Math.random() * 5)) {
            case 0:
                interaction.reply("Definitely.")
                cachedRatings[args] = "Definitely."
                break
            case 1:
                interaction.reply("Probably.")
                cachedRatings[args] = "Probably."
                break
            case 2:
                interaction.reply("Maybe.")
                cachedRatings[args] = "Maybe."
                break
            case 3:
                interaction.reply("Unlikely.")
                cachedRatings[args] = "Unlikely."
                break
            case 4:
                interaction.reply("Definitely not.")
                cachedRatings[args] = "Definitely not."
                break
            default:
                interaction.reply("An error occured while rolling the 8-ball.")
                break
        }
    }
}