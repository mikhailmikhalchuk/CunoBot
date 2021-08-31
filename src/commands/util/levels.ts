import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
var loop = true

module.exports = {
    data: new SlashCommandBuilder()
        .setName('levels')
        .setDescription("Lists or changes the roles bound to the bot's level measurement")
        .setDefaultPermission(false)
        .addSubcommand(subcommand => subcommand.setName('list').setDescription('Lists the roles the bot uses for level measurement'))
        .addSubcommand(subcommand => subcommand.setName('change').setDescription('Changes the roles the bot uses for level measurement').addRoleOption(option => option.setName('mod').setDescription("Sets the \"moderator\" role").setRequired(true)).addRoleOption(option => option.setName('admin').setDescription("Sets the \"administrator\" role").setRequired(true))),
    async execute(interaction: Discord.CommandInteraction) {
        const args = interaction.options.getSubcommand()
        var level1list
        var level2list
        global.PermissionsList.forEach((e: any[string]) => {
            if (e["server"] == interaction.guild.id) {
                level1list = e["level1"]
                level2list = e["level2"]
            }
        })
        if (args == "list") {
            return interaction.reply({embeds: [global.Functions.BasicEmbed("normal")
                .setAuthor("Levels")
                .addField("Level 2", `<@&${level2list}>`)
                .addField("Level 1", `<@&${level1list}>`)
                .addField("Level 0", "@everyone")
                .addField("Your Level", `Level ${await global.Functions.getUserLevel(interaction.guild, (interaction.member as Discord.GuildMember))}`)]})
        }
        else {
            const mod = interaction.options.getRole('mod')
            const admin = interaction.options.getRole('admin')
            if (mod.id == interaction.guild.roles.cache.find(r => r.name === "@everyone").id || admin.id == interaction.guild.roles.cache.find(r => r.name === "@everyone").id) {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Moderator and administrator roles cannot be set to `@everyone`")], ephemeral: true})
            }
            else if (mod.id == admin.id) {
                return interaction.reply({embeds: [global.Functions.BasicEmbed(("error"), "Moderator and administrator roles must be different")], ephemeral: true})
            }
            await mongoClient.connect()
            await mongoClient.db("Servers").collection("Permissions").updateOne({server: interaction.guild.id}, {$set: {level1: mod.id, level2: admin.id}})
            global.PermissionsList = await mongoClient.db("Servers").collection("Permissions").find({}).toArray();
            mongoClient.close()
            return interaction.reply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully changed bot permissions.")], ephemeral: true})
        }
    }
}