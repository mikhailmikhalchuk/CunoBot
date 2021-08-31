import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Makes the bot send a message')
        .addStringOption(option => option.setName('content').setDescription('The content to send').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the message in (default this channel)')),
    async execute(interaction: Discord.CommandInteraction) {
        const channel = interaction.options.getChannel('channel')
        const content = interaction.options.getString('content')
        /*if (message.attachments.size > 0) {
            message.attachments.forEach(function (attachment: Discord.MessageAttachment) {
                const att = new Discord.MessageAttachment(attachment.url);
                if (args[0] == "") {
                    if (message.mentions.channels.first() != undefined && args[0].slice(2, 20) == message.mentions.channels.first().id) {
                        (message.guild.channels.resolve(message.mentions.channels.first().toString()) as Discord.TextChannel).send({files: [att]})
                    }
                    else {
                        message.channel.send({files: [att]})
                    }
                }
                else {
                    if (message.mentions.channels.first() != undefined && args[0].slice(2, 20) == message.mentions.channels.first().id) {
                        (message.guild.channels.resolve(message.mentions.channels.first().toString()) as Discord.TextChannel).send({files: [args.slice(1).join(" "), att]})
                    }
                    else {
                        message.channel.send({files: [args.join(" "), att]})
                    }
                }
            })
        }*/
        if (channel != null) {
            (interaction.guild.channels.cache.get(channel.name) as Discord.TextChannel).send(content)
        }
        else {
            interaction.channel.send(content)
        }
    }
}