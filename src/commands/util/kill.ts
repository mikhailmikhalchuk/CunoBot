import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
const dateFormat = require('dateformat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Forces a bot disconnection and terminates the process')
        .setDefaultPermission(false),
    async execute(interaction: Discord.CommandInteraction) {
        const d = new Date();
        console.log(`Bot has disconnected.\nTaken offline at ${dateFormat(d, "h:MM:ss TT")}.`)
        interaction.reply({content: "Terminating bot...", ephemeral: true}).then(() => {
            global.Client.destroy()
            process.exit(0)
        })
    }
}