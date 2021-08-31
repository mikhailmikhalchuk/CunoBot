import Discord from 'discord.js'
const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a user')
        .addMentionableOption(option => option.setName('member').setDescription('The member to mute').setRequired(true)),
    async execute(interaction: Discord.CommandInteraction) {
        await mongoClient.connect()
        const check = await mongoClient.db("Servers").collection("Muted Roles").findOne({server: interaction.guild.id})
        mongoClient.close()
        var getRole = interaction.guild.roles.cache.find(role => role.name === "Cuno's Bot").position
        const member = interaction.options.getMentionable('member')
        if ((interaction.member as Discord.GuildMember).roles.highest.position <= (member as Discord.GuildMember).roles.highest.position && interaction.user.id != interaction.guild.ownerId) {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Cannot mute users ranked the same or higher than you.")]})
        }
        if (check == undefined) {
            await interaction.reply("No muted role detected, creating one...")
            interaction.guild.roles.create({name: 'Muted', color: 'GREY', position: getRole, permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'CONNECT'], reason: 'No existing muted role'}).then((r) => {
                interaction.editReply("Successfully created muted role.")
                interaction.guild.members.resolve((member as Discord.GuildMember)).roles.add(r.id, "Mute command used").then(async () => {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Muted Roles").insertOne({server: interaction.guild.id, role: r.id})
                    mongoClient.close()
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully muted user.")]})
                })
            })
        }
        else if (interaction.guild.roles.cache.find(role => role.id === check["role"]) == undefined) {
            await interaction.reply("Couldn't find muted role in this server from database, creating one...")
            interaction.guild.roles.create({name: 'Muted', color: 'GREY', position: getRole, permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'CONNECT'], reason: 'No existing muted role'}).then((r) => {
                interaction.editReply("Successfully created muted role.")
                interaction.guild.members.resolve((member as Discord.GuildMember)).roles.add(r.id, "Mute command used").then(async () => {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Muted Roles").updateOne({server: interaction.guild.id}, {$set: {role: r.id}})
                    mongoClient.close()
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully muted user.")]})
                })
            })
        }
        else if ((member as Discord.GuildMember).roles.cache.find(role => role.id === check["role"]) != undefined) {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "User already muted.")]})
        }
        else if ((member as Discord.GuildMember).user.id == "660856814610677761") {
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "You can't mute me!")]})
        }
        else {
            interaction.guild.members.resolve((member as Discord.GuildMember)).roles.add(check["role"], "Mute command used").then(() => {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully muted user.")]})
            })
            .catch((e) => {
                if (e.message == "Missing Permissions") {
                    return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "The muted role is above my role in this server's role hierarchy.\nPlease move it below my role and try again.")]})
                }
            })
        }
    }
}