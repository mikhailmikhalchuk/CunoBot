import Discord from 'discord.js'
var cachedRatings: any = {"dummy":"4"}
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Has the bot rate a message on a scale of 0 to 10')
        .addStringOption(option => option.setName("message").setDescription('The message to rate')),
    async execute(interaction: Discord.CommandInteraction) {
        const content = interaction.options.getString('message')
        if (content.startsWith("<@!")) {
            var men = content.slice(3, 20)
        }
        else if (content.toLowerCase() == "cuno's bot" || content.toLowerCase() == "you" || content.toLowerCase() == "yourself" || men == "660856814610677761" || content == "660856814610677761") {
            return interaction.reply("I'd give myself a 10/10")
        }
        else if (content.toLowerCase() == "cuno" || content.toLowerCase() == "mikhailmcraft" || men == "287372868814372885" || content == "287372868814372885") {
            return interaction.reply(`I'd give ${content} a 10/10`)
        }
        else if (content.toLowerCase() == "me" || content.toLowerCase() == "myself" || content.toLowerCase() == interaction.user.username.toLowerCase() || men == interaction.user.id) {
            if (interaction.user.id == "287372868814372885") {
                return interaction.reply("I'd give you a 10/10")
            }
            if (cachedRatings[interaction.user.id] != undefined) {
                return interaction.reply(`I'd give you a ${cachedRatings[interaction.user.id]}/10`)
            }
            var random = Math.floor(Math.random() * 11)
            interaction.reply(`I'd give you a ${random}/10`)
            return cachedRatings[interaction.user.id] = random.toString()
        }
        else if (cachedRatings[content] != undefined) {
            return interaction.reply(`I'd give ${content} a ${cachedRatings[content]}/10`)
        }
        var random = Math.floor(Math.random() * 11)
        interaction.reply(`I'd give ${content} a ${random}/10`)
        return cachedRatings[content] = random.toString()
    }
}