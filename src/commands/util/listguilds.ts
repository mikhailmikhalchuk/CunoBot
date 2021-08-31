import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
const serverList: any[] = []

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listguilds')
        .setDescription('Lists all servers the bot is in')
        .setDefaultPermission(false),
    async execute(interaction: Discord.CommandInteraction) {
        serverList.splice(0)
        global.Client.guilds.cache.forEach(server => serverList.push(server.name))
        interaction.reply({embeds: [global.Functions.BasicEmbed("normal")
        .setAuthor("Servers")
        .setDescription(serverList.toString().replace(/,/g, "\n"))], ephemeral: true})
    }
}