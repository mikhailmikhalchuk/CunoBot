import Discord from 'discord.js'
const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Configures server logging')
        .setDefaultPermission(false),
    async execute(interaction: Discord.CommandInteraction) {
        // Never set up logging or channel was deleted
        await mongoClient.connect()
        const check = await mongoClient.db("Servers").collection("Logging").findOne({server: interaction.guild.id})
        mongoClient.close()
        if (check == undefined || interaction.guild.channels.resolve(check["channel"]) == undefined) {
            await interaction.reply("I cannot find a logging channel for this server in my database. Please mention a channel to set logging to. (\`cancel\` to cancel)")
            const filter = (m: Discord.Message) => m.author.id == interaction.user.id;
            interaction.channel.awaitMessages({ filter, max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                if (c.first().content.toLowerCase() == "cancel") {
                    return interaction.editReply("Cancelled command.")
                }
                else if (c.first().content.startsWith("<#") == false) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)")]})
                }
                await mongoClient.connect()
                var db = mongoClient.db("Servers").collection("Logging")
                if (check != undefined && interaction.guild.channels.resolve(check["channel"]) == undefined) {
                    await db.updateOne({server: interaction.guild.id}, {$set: {channel: c.first().content.slice(2, 20), status: true}})
                }
                else {
                    await db.insertOne({server: interaction.guild.id, channel: c.first().content.slice(2, 20), status: true})
                }
                mongoClient.close()
                return interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), `Successfully set logging channel to ${c.first().content}.`)]})
            })
        }
        // Logging set up and ok
        else {
            const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('enable')
                    .setLabel('Enable')
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('disable')
                    .setLabel('Disable')
                    .setStyle('DANGER'),
                new Discord.MessageButton()
                    .setCustomId('change')
                    .setLabel('Change Channel')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('ignore')
                    .setLabel('Ignore Channel')
                    .setStyle('SECONDARY'),
                new Discord.MessageButton()
                    .setCustomId('remove')
                    .setLabel('Remove Channel')
                    .setStyle('DANGER')
            )

            await interaction.reply({content: `Logging: **${check["status"] == false ? "Disabled" : "Enabled"}**\nChoose an option`, components: [row]})

            interaction.channel.createMessageComponentCollector({time: 15000}).on('collect', async (interaction2) => {
                await interaction2.update({components: []})
                if (interaction2.customId == "disable" && check["status"] == true) {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Logging").updateOne({server: interaction.guild.id}, {$set: {status: false}})
                    mongoClient.close()
                    interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully disabled logging.")]})
                    return;
                }
                else if (interaction2.customId == "disable" && check["status"] == false) {
                    interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Logging already disabled.")]})
                    return;
                }
                else if (interaction2.customId == "enable" && check["status"] == false) {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Logging").updateOne({server: interaction.guild.id}, {$set: {status: true}})
                    mongoClient.close()
                    interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully enabled logging.")]})
                    return;
                }
                else if (interaction2.customId == "enable" && check["status"] == true) {
                    interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Logging already enabled.")]})
                    return;
                }
                else if (interaction2.customId == "change") {
                    await interaction.editReply({embeds: [global.Functions.BasicEmbed(("normal"), `What would you like to change the logging channel to? (Currently <#${check["channel"]}>, \`cancel\` to cancel)`)]})
                    const filter = (m: Discord.Message) => m.author.id == interaction.user.id;
                    interaction.channel.awaitMessages({ filter, max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        if (c.first().content.toLowerCase() == "cancel") {
                            interaction.editReply("cancelled command.")
                            return;
                        }
                        else if (c.first().content.startsWith("<#") == false) {
                            interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to change the logging channel to. (EX: #logging)")]})
                            return;
                        }
                        else if (c.first().content.slice(2, 20) == check["channel"]) {
                            interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Please choose a different channel.")]})
                            return;
                        }
                        await mongoClient.connect()
                        await mongoClient.db("Servers").collection("Logging").updateOne({server: interaction.guild.id}, {$set: {channel: c.first().content.slice(2, 20)}})
                        mongoClient.close()
                        interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), `Successfully changed logging channel to ${c.first().content}.`)]})
                        return;
                    })
                }
                else if (interaction2.customId == "ignore") {
                    await interaction.editReply({embeds: [global.Functions.BasicEmbed(("normal"), `What channel would you like to add to the ignore list? (mention a channel already in the ignore list to remove it, \`cancel\` to cancel).\nChannels currently in the ignored list: ${check["ignored"] == undefined ? "None" : "<#" + check["ignored"].toString().replace(/,/g, ">, <#") + ">"}`)]})
                    const filter = (m: Discord.Message) => m.author.id == interaction.user.id;
                    interaction.channel.awaitMessages({ filter, max: 1, time: 1.8e+6, errors: ['time'] }).then(async c => {
                        if (c.first().content.toLowerCase() == "cancel") {
                            interaction.editReply("cancelled command.")
                            return;
                        }
                        else if (c.first().content.startsWith("<#") == false && !check["ignored"].includes(c.first().content.slice(2, 20))) {
                            interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Invalid channel. Please mention the channel you would like to ignore/unignore. (EX: #logging)")]})
                            return;
                        }
                        await mongoClient.connect()
                        if (check["ignored"] == undefined) {
                            const newList = []
                            newList.push(c.first().content.slice(2, 20))
                            await mongoClient.db("Servers").collection("Logging").updateOne({server: interaction.guild.id}, {$set: {ignored: newList}})
                            mongoClient.close()
                            interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), `Successfully added ${c.first().content} to the ignored list.`)]})
                            return;
                        }
                        else if (check["ignored"].toString().includes(c.first().content.slice(2, 20)) == true) {
                            var newList = check["ignored"].splice(check["ignored"].indexOf(c.first().content.slice(2, 20)) - 1, 1)
                            if (newList.length == 1) {
                                newList = undefined
                            }
                            await mongoClient.db("Servers").collection("Logging").updateOne({server: interaction.guild.id}, {$set: {ignored: newList}})
                            mongoClient.close()
                            interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), `Successfully removed ${c.first().content} from the ignored list.`)]})
                            return;
                        }
                        else {
                            const newList = check["ignored"]
                            newList.push(c.first().content.slice(2, 20))
                            await mongoClient.db("Servers").collection("Logging").updateOne({server: interaction.guild.id}, {$set: {ignored: newList}})
                            mongoClient.close()
                            interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), `Successfully added ${c.first().content} to the ignored list.`)]})
                            return;
                        }
                    })
                }
                else if (interaction2.customId == "remove") {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Logging").updateOne({server: interaction.guild.id}, {$set: {channel: undefined}})
                    mongoClient.close()
                    interaction.editReply({embeds: [global.Functions.BasicEmbed(("success"), "Successfully removed logging channel.")]})
                    return;
                }
            })
        }
    }
}