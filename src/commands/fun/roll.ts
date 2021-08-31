import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a die, with the amount of sides decided by the user. Defauls to 6')
        .addIntegerOption(option => option.setName('sides').setDescription('The amount of sides to roll the die with')),
    async execute(interaction: Discord.CommandInteraction) {
        var roll = interaction.options.getInteger('sides')
        if (roll == null) roll = 6
        await interaction.reply({embeds: [global.Functions.BasicEmbed(("normal"), " ")
            .setAuthor("Rolling...")
            .addField("Sides", roll.toString())]})
        if (isNaN(Number(roll))) {
            return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), `${roll} is not a number!`)]})
        }
        if (Number(roll) <= 0) {
            return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Please pick a number greater than one.")]})
        }
        if (roll == Infinity) {
            return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "You cannot roll infinity!")]})
        }
        if (Number(roll) == 1) {
            return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Please pick a number greater than one.")]})
        }
        if (Number.isInteger(roll * 1) == false) {
            return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Please pick a whole number.")]})
        }
        setTimeout(function () {
            interaction.editReply({embeds: [global.Functions.BasicEmbed("success")
                .setAuthor("Rolled")
                .addField("Sides", roll.toString())
                .addField("Result", Math.ceil(Math.random() * roll).toString())]})
        }, 1000)
    }
}