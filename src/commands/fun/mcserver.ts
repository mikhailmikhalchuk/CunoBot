import mcping from "mcping-js";
import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcserver')
        .setDescription('Gets Minecraft server info')
        .addStringOption(option => option.setName('serveraddress').setDescription("The server's address").setRequired(true))
        .addIntegerOption(option => option.setName('port').setDescription("The port to search for the server on").setRequired(false)),
    async execute(interaction: Discord.CommandInteraction) {
        var date = Date.now();
        const port = interaction.options.getInteger('port');
        const address = interaction.options.getString('serveraddress');
        if (port != null) {
            interaction.reply("Port is invalid, switching to 25565...")
        }
        new mcping.MinecraftServer(address, port != 0 && port != undefined ? port : 25565).ping(10000, 754, (err, res) => {
            if (err) {
                if (err.message == "read ECONNRESET" || err.message.startsWith("getaddrinfo ENOTFOUND")) {
                    if (!interaction.replied) return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Could not reach the server. Ensure your server address and port are valid.")]})
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Could not reach the server. Ensure your server address and port are valid.")]})
                }
                else if (err.message.startsWith("connect ECONNREFUSED")) {
                    if (!interaction.replied) return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "The connection was refused. No further information.")]})
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "The connection was refused. No further information.")]})
                }
                if (!interaction.replied) return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), err)]})
                return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), err)]})
            }
            var embed = global.Functions.BasicEmbed("normal")
                .setTitle(`${address} ${address.startsWith("192") ? "(local server)" : ""}`)
                .addField("Version", res.version.name, true)
                .addField("Players", `${res.players.online} / ${res.players.max}`, true)
                .addField("Ping", `${Date.now() - date} ms`)
            if (res.players.sample != undefined) {
                if (res.players.sample[0] != undefined) {
                    var list = ""
                    for (var player in res.players.sample) {
                        list += `${res.players.sample[player].name}\n`
                    }
                    embed = embed
                        .addField("Player List", list)
                }
                else {
                    embed = embed
                        .addField("Player List", "Too many players")
                }
            }
            else {
                embed = embed
                    .addField("Player List", "No players online")
            }
            if (interaction.replied) return interaction.editReply({embeds: [embed]});
            interaction.reply({embeds: [embed]})
        })
    }
}