import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
const dateFormat = require('dateformat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getmessage')
        .setDescription('Gets a message based on ID')
        .addStringOption(option => option.setName('message').setDescription('The ID of the message to return')),
    async execute(interaction: Discord.CommandInteraction) {
        interaction.channel.messages.fetch(interaction.options.getString('message')).then(m => {
            if (m.attachments.size > 0) {
                var attachment = m.attachments.first()
                return interaction.reply({content: m.url, embeds: [global.Functions.BasicEmbed("normal")
                    .setAuthor(m.author.username, m.author.avatarURL({format: 'png', dynamic: true}))
                    .addField("Content", m.content == "" ? "_ _" : m.content)
                    .addField("Attachments", attachment.url)
                    .addField("Date sent", dateFormat(m.createdAt, "mmmm dS, yyyy 'at' h:MM TT '(EST)'"))]})
            }
            return interaction.reply({content: m.url, embeds: [global.Functions.BasicEmbed("normal")
                .setAuthor(m.author.username, m.author.avatarURL({format: 'png', dynamic: true}))
                .addField("Content", m.content == "" ? "_ _" : m.content)
                .addField("Date sent", dateFormat(m.createdAt, "mmmm dS, yyyy 'at' h:MM TT '(EST)'"))]})
        })
        .catch((e) => {
            if (e.message.startsWith("Unknown") || e.message.startsWith("404")) {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Message not found.")]})
            }
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), e)]})
        })
    }
}