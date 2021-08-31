import Jimp from "jimp"
import Discord from "discord.js"
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('monochrome')
        .setDescription('Applies a monochromatic filter to an image')
        .addStringOption(option => option.setName('link').setDescription('A link to an image').setRequired(true)),
    async execute(interaction: Discord.CommandInteraction) {
        await interaction.reply('Applying filter...')
        Jimp.read(interaction.options.getString('link')).then(d => {
            d.posterize(10).sepia().getBufferAsync(Jimp.MIME_PNG).then(async a => {
                await interaction.editReply("Finished, sending to channel...")
                interaction.editReply({content: "Finished", files: [a]})
                .catch(e => {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', e)]})
                })
            })
            .catch(e => {
                if (e.message == undefined) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', e)]})
                }
                else if (e.message.startsWith("ENOENT:")) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "Please provide a valid image link.")]})
                }
                return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', e)]})
            })
        })
        .catch(e => {
            if (e.message == undefined) {
                return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', e)]})
            }
            else if (e.message.startsWith("ENOENT:")) {
                return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "Please provide a valid image link.")]})
            }
            return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', e)]})
        })
    }
}