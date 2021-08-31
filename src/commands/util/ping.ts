import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the speed at which the bot is functioning'),
    async execute(interaction: Discord.CommandInteraction) {
        const t = Date.now()
        await interaction.reply("Pinging...")
        interaction.editReply({embeds: [global.Functions.BasicEmbed("normal")
            .setAuthor("Pong!")
            .addField("Bot Ping", `${Math.round(global.Client.ws.ping)} ms`)
            .addField("Server Ping", `${Math.round(Date.now() - t)} ms`)]})
    }
}