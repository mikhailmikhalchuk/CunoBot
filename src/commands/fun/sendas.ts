import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendas')
        .setDescription('Sends a message as a webhook with the name and image provided by the user')
        .setDefaultPermission(false)
        .addStringOption(option => option.setName('name').setDescription('The name to use for the webhook').setRequired(true))
        .addStringOption(option => option.setName('link').setDescription('A link to an image').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('The message to have the webhook send').setRequired(true)),
    async execute(interaction: Discord.CommandInteraction) {
        interaction.ephemeral = true;
        (interaction.channel as Discord.TextChannel).createWebhook(interaction.options.getString('name'), {avatar: interaction.options.getString('link')}).then((w) => {
            w.send(interaction.options.getString('message')).then(() => {w.delete()})
        })
        .catch((e) => {
            if (e.message.startsWith("ENOENT: no such file or directory, stat")) {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Misplaced argument.")]})
            }
            else {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), e)]})
            }
        })
    }
}