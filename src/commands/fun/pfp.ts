import Discord from "discord.js"
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pfp')
        .setDescription("Returns a user's avatar")
        .addMentionableOption(option => option.setName('member').setDescription("The member who's avatar to retrieve"))
        .addStringOption(option => option.setName('userid').setDescription("The ID of the user who's avatar to retrieve")),
    async execute(interaction: Discord.CommandInteraction) {
        const member = interaction.options.getMentionable('member', false)
        const id = interaction.options.getString("userid")
        if (member != null) {
            return interaction.reply({embeds: [global.Functions.BasicEmbed('normal', ' ').setTitle(`${(member as Discord.GuildMember).displayName}'s avatar`).setImage((member as Discord.GuildMember).user.displayAvatarURL({format: 'png', dynamic: true}))]})
        }
        else if (id != null) {
            global.Client.users.fetch(id).then((m) => {
                return interaction.reply({embeds: [global.Functions.BasicEmbed('normal', ' ').setTitle(`${m.username}#${m.discriminator}'s avatar`).setImage(m.displayAvatarURL({format: 'png', dynamic: true}))]})
            })
        }
        else {
            return interaction.reply({embeds: [global.Functions.BasicEmbed('error', 'Must specify arguments for either `member` or `userid`')]});
        }
    }
}