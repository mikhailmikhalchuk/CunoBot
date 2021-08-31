import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Gets information about a user')
        .addMentionableOption(option => option.setName('user').setDescription('The user to get information on').setRequired(true)),
    async execute(interaction: Discord.CommandInteraction) {
        await interaction.reply({embeds: [global.Functions.BasicEmbed(("normal"), "Gathering data...")]})
        const member = (interaction.options.getMentionable('user') as Discord.GuildMember)
        var embed = global.Functions.BasicEmbed("normal")
        //Presence Data
        const game = member.presence.activities[0]
        if (game) {
            if (game.type == "LISTENING") {
                embed = embed.setDescription(`*Listening to ${game.name}: ${game.details} by ${game.state}*`)
            }
            else if (game.type == "WATCHING") {
                embed = embed.setDescription(`*Watching ${game.name}*`)
            }
            else if (game.type == "STREAMING") {
                embed = embed.setDescription(`*Streaming ${game.name}: ${game.url}*`)
            }
            else {
                switch (game.name) {
                    case "Fortnite":
                        embed = embed.setDescription(`*Playing Fortnite: ${game.details} | ${game.state}*`)
                        break
                    case "Roblox":
                        embed = embed.setDescription(`*Playing Roblox: ${game.details}*`)
                        break
                    case "Paladins":
                        embed = embed.setDescription(`*Playing Paladins: ${game.state}*`)
                        break
                    case "Visual Studio Code":
                        embed = embed.setDescription(`*Visual Studio Code: ${game.details}*\n*${game.state}*`)
                        break
                    case "Custom Status":
                        if (game.emoji == null) embed = embed.setDescription(`*${game.state}*`)
                        else embed = embed.setDescription(`*:${game.emoji.name}: ${game.state}*`)
                        break
                    default:
                        embed = embed.setDescription(`*Playing ${game.name}*`)
                        break
                }
            }
        }
        //Status
        var emoji = ""
        var stat = ""
        switch (member.presence.status) {
            case "online":
                emoji = "<:online:666789311722553376>"
                stat = "Online"
                break
            case "offline":
                emoji = "<:offline:666790009399148564>"
                stat = "Offline"
                break
            case "idle":
                emoji = "<:idle:666789999726952454>"
                stat = "Idle"
                break
            case "dnd":
                emoji = "<:dnd:666789986447785986>"
                stat = "DnD"
                break
            default:
                emoji = ""
                stat = "Unknown"
                break
        }
        var levelList: any[string] = []
        global.PermissionsList.forEach((e: any[string]) => {
            if (e["server"] == interaction.guild.id) {
                levelList = e
            }
        })
        if (game && game.type == "STREAMING") {
            emoji = "<:streaming:671128707603103799>"
            stat = `[Streaming](${game.url})` 
        }
        var level = await global.Functions.getUserLevel(interaction.guild, member)
        var members: string[] = [];
        member.roles.cache.forEach((role) => {
            members.push(role.name);
        });
        embed = embed
            .setAuthor(member.displayName, member.user.avatarURL({format: 'png', dynamic: true}))
            .addField("Username", member.user.tag, true)
            .addField("ID", member.id, true)
            .addField("Status", `${emoji} ${stat}`, true)
            .addField("Account Creation", member.user.createdAt.toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"}), true)
            .addField("Joined Server", member.joinedAt.toLocaleString('en-US', {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"}), true)
            .addField("Bot Permissions", `${level} (${level == 3 ? "Bot Owner" : level == 0 ? "Normal User" : level == -1 ? "Bot" : interaction.guild.roles.resolve(levelList[`level${level}`]).name})`, true)
            .addField("Roles", members.join(", "))
        interaction.editReply({embeds: [embed]})
    }
}