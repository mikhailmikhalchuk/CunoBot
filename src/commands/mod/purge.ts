import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk deletes messages')
        .addIntegerOption(option => option.setName('messages').setDescription('The number of messages to delete').setRequired(true))
        .setDefaultPermission(false),
    async execute(interaction: Discord.CommandInteraction) {
        const num = interaction.options.getInteger('messages')
        if (num >= 100) {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "You cannot delete more than 100 messages.")], ephemeral: true})
        }
        else if (num < 1) {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "You must assign an amount of messages to delete equal to or greater than 1.")], ephemeral: true})
        }
        (interaction.channel as Discord.TextChannel).bulkDelete(num + 1, true).then((m) => {
            var messages = m.size == 2 ? "message" : "messages"
            if (m.size == 1) {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Cannot delete messages older than 14 days.")], ephemeral: true})
            }
            else if (m.size < num + 1) {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("success"), `Successfully deleted ${m.size - 1} ${messages}.\n${num + 1 - m.size} could not be deleted.`)
                    .setAuthor("Purged")]})
            }
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("success"), `Successfully deleted ${m.size - 1} ${messages}.`)
                .setAuthor("Purged")]})
        })
    }
}