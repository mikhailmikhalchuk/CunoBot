import axios, { AxiosResponse } from 'axios';
import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders';
import * as Destiny from '../../interfaces';
const dateFormat = require("dateformat");
const itemManifest = require('../../data/DestinyManifest.json')
var OGType = 0
var listen = true
var page = 0
const characterTest = /[#*+:<>?]+/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('destiny')
        .setDescription('Queries the Destiny API')
        .addSubcommand(subcommand => subcommand.setName('item').setDescription('Search for an item').addStringOption(option => option.setName('keywords').setDescription('The keyword(s) to search with').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('player').setDescription('Search for a player').addStringOption(option => option.setName('username').setDescription('The username of the user to search for').setRequired(true))),
    async execute(interaction: Discord.CommandInteraction) {
        const args = interaction.options.getSubcommand();
        const searchName = interaction.options.getString('username');
        const itemSearch = interaction.options.getString('keyword');
        var subclass: number, kinetic: number, energy: number, power: number, ghost: number, vehicle: number, ship: number = 0
        if (args == "item") {
            listen = false
            page = 0
            var embed = global.Functions.BasicEmbed("normal")
            interaction.reply("Searching database for items...").then(async () => {
                if (characterTest.test(args)) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Entered keyword(s) cannot contain the following characters:\n```# (Hashtag)\n* (Asterisk)\n+ (Plus)\n: (Colon)\n< (Left Angle Bracket)\n> (Right Angle Bracket)\n? (Question Mark)```")]})
                }
                if (args.length > 100) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Entered keyword(s) cannot exceed 100 characters in length.")]})
                }
                const res = await axios.get<Destiny.ServerResponse<Destiny.DestinyEntitySearchResult>>(`https://www.bungie.net/Platform/Destiny2/Armory/Search/DestinyInventoryItemDefinition/${encodeURIComponent(itemSearch)}/`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                if (res.data.ErrorCode == Destiny.PlatformErrorCodes.SystemDisabled) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "The API is currently down for maintenance, please try again later.")]})
                }
                else if (res.data.ErrorCode != Destiny.PlatformErrorCodes.Success) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "An error occurred while fetching data from the API.")]})
                }
                if (res.data.Response.results.totalResults == 0) {
                    return interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), `No results found.${res.data.Response.suggestedWords[0] != undefined ? `\nRecommended keywords to search with: \`${res.data.Response.suggestedWords.join(", ")}\`` : ""}`)]})
                }
                interaction.editReply("Grabbing item definitions from manifest...")
                var item: Destiny.DestinyInventoryItemDefinition = itemManifest[res.data.Response.results.results[0].hash]
                if (item.itemType == 3 && item.traitIds[1] != 'weapon_type.rocket_launcher') {
                    embed = embed
                        .setTitle(`${res.data.Response.results.results[0].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                        .setDescription(`*${item.flavorText != "" ? item.flavorText : item.displayProperties.description != "" ? item.displayProperties.description : "No description provided"}*`)
                        .addField("Tier", item.inventory.tierTypeName, true)
                        .addField("Impact", item.stats.stats[4043523819].value.toString(), true)
                        .addField("Range", item.stats.stats[1240592695].value.toString(), true)
                        .addField("Magazine Size", item.stats.stats[3871231066].value.toString(), true)
                        .addField("Link", `[${res.data.Response.results.results[0].displayProperties.name}](https://light.gg/db/items/${res.data.Response.results.results[0].hash})`)
                        .setImage(`https://www.bungie.net${res.data.Response.results.results[0].displayProperties.icon}`)
                }
                else {
                    embed = embed
                        .setTitle(`${res.data.Response.results.results[0].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                        .setDescription(`*${item.flavorText != "" ? item.flavorText : item.displayProperties.description != "" ? item.displayProperties.description : "No description provided"}*`)
                        .addField("Tier", item.inventory.tierTypeName, true)
                        .addField("Link", `[${res.data.Response.results.results[0].displayProperties.name}](https://light.gg/db/items/${res.data.Response.results.results[0].hash})`)
                        .setImage(`https://www.bungie.net${res.data.Response.results.results[0].displayProperties.icon}`)
                }
                interaction.editReply({embeds: [embed]})
                /*interaction.editReply({embeds: [embed]}).then(async m => {
                    listen = true
                    m.react('⬅️')
                    m.react('➡️')
                    while (listen == true) {
                        const filter = (reaction: Discord.MessageReaction, user: Discord.User) => user.id === interaction.user.id;
                        await m.awaitReactions({filter, max: 1, time: 1.8e+6, errors: ['time']}).then(async c => {
                            if (c.first().emoji.name == "➡️") {
                                if (page + 1 > res.data.Response.results.totalResults) {
                                    return true
                                }
                                page++
                            }
                            else if (c.first().emoji.name == "⬅️") {
                                if (page - 1 < 0) {
                                    return true
                                }
                                page--
                            }
                            m.reactions.removeAll()
                            m.react('⬅️')
                            m.react('➡️')
                            item = itemManifest[res.data.Response.results.results[page].hash]
                            if (item.itemType == Destiny.DestinyItemType.Weapon) {
                                m.edit({embeds: [global.Functions.BasicEmbed("normal")
                                    .setTitle(`${res.data.Response.results.results[page].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                                    .setDescription(`*${item.flavorText != "" ? item.flavorText : item.displayProperties.description != "" ? item.displayProperties.description : "No description provided"}*`)
                                    .addField("Tier", item.inventory.tierTypeName, true)
                                    .addField("Impact", item.stats.stats[4043523819].value.toString(), true)
                                    .addField("Range", item.stats.stats[1240592695].value.toString(), true)
                                    .addField("Magazine Size", item.stats.stats[3871231066].value.toString(), true)
                                    .addField("Link", `[${res.data.Response.results.results[page].displayProperties.name}](https://light.gg/db/items/${res.data.Response.results.results[page].hash})`)
                                    .setImage(`https://www.bungie.net${res.data.Response.results.results[page].displayProperties.icon}`)]})
                            }
                            else {
                                m.edit({embeds: [global.Functions.BasicEmbed("normal")
                                .setTitle(`${res.data.Response.results.results[page].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                                .setDescription(`*${item.flavorText != "" ? item.flavorText : item.displayProperties.description != "" ? item.displayProperties.description : "No description provided"}*`)
                                .addField("Tier", item.inventory.tierTypeName, true)
                                .addField("Link", `[${res.data.Response.results.results[page].displayProperties.name}](https://light.gg/db/items/${res.data.Response.results.results[page].hash})`)
                                .setImage(`https://www.bungie.net${res.data.Response.results.results[page].displayProperties.icon}`)]})
                            }
                            return true
                        })
                        .catch((c) => {
                            m.reactions.removeAll()
                            return listen = false
                        })
                    }
                })*/
            })
        }
        else if (args == "player") {
            listen = false
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('general')
                        .setLabel('General')
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId('stats')
                        .setLabel('Statistics')
                        .setStyle('SECONDARY')
                )

            await interaction.reply({content: "Choose a return type", components: [row]})

            interaction.channel.createMessageComponentCollector({time: 15000}).on('collect', async (interaction2) => {
                await interaction2.update({components: []})
                if (!searchName.includes("#")) {
                    interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "Please include the player's discriminator (EX: Player#1234)")]})
                    return;
                }
                const res = await axios.get<Destiny.ServerResponse<Destiny.UserInfoCard[]>>(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/All/${encodeURIComponent(searchName)}/`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                if (res.data.ErrorCode == Destiny.PlatformErrorCodes.SystemDisabled) {
                    interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "The API is currently down for maintenance, please try again later.")]})
                    return;
                }
                else if (res.data.ErrorCode == Destiny.PlatformErrorCodes.UserBanned) {
                    interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "Requested user is banned from Bungie services.")]})
                    return;
                }
                else if (res.data.ErrorCode != Destiny.PlatformErrorCodes.Success) {
                    interaction.editReply({embeds: [global.Functions.BasicEmbed('error', "An error occurred while fetching data from the API.")]})
                    return;
                }
                if (res.data.Response[0] == undefined) {
                    interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Could not find user.")]})
                    return;
                }
                interaction.editReply("Gathering character information, please wait...")
                const res1 = await axios.get<Destiny.ServerResponse<Destiny.DestinyProfileResponse>>(`https://www.bungie.net/Platform/Destiny2/${res.data.Response[0].membershipType}/Profile/${res.data.Response[0].membershipId}/?components=CharacterEquipment,Characters,CharacterActivities`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                var embed = global.Functions.BasicEmbed("normal")
                if (interaction2.customId == "general") {
                    var res9: AxiosResponse<Destiny.ServerResponse<Destiny.DestinyActivityDefinition>>
                    var res10: AxiosResponse<Destiny.ServerResponse<Destiny.DestinyActivityDefinition>>
                    interaction.editReply("Gathering inventory information, please wait...")
                    kinetic = itemManifest[res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[0].itemHash].itemType == Destiny.DestinyItemType.Weapon ? res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[0].itemHash : 0
                    energy = itemManifest[res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[1].itemHash].itemType == Destiny.DestinyItemType.Weapon ? res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[1].itemHash : 0
                    power = itemManifest[res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[2].itemHash].itemType == Destiny.DestinyItemType.Weapon ? res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[2].itemHash : 0
                    for (var item of res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items) {
                        switch (itemManifest[item.itemHash].itemType) {
                            case Destiny.DestinyItemType.Subclass:
                                subclass = item.itemHash
                                break
                            case Destiny.DestinyItemType.Ship:
                                ship = item.itemHash
                                break
                            case Destiny.DestinyItemType.Vehicle:
                                vehicle = item.itemHash
                                break
                            case Destiny.DestinyItemType.Ghost:
                                ghost = item.itemHash
                                break
                        }
                    }
                    interaction.editReply("Gathering activity information, please wait...")
                    const res8 = await axios.get<Destiny.ServerResponse<Destiny.DestinyActivityHistoryResults>>(`https://www.bungie.net/Platform/Destiny2/${res.data.Response[0].membershipType}/Account/${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].membershipId}/Character/${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].characterId}/Stats/Activities/?count=1&mode=None&page=0`, {
                        headers: {
                            'X-API-Key': global.Auth.destinyAPI,
                            'User-Agent': global.Auth.destinyUserAgent
                        }
                    })
                    if (res8.data.Response.activities != undefined) {
                        res9 = await axios.get<Destiny.ServerResponse<Destiny.DestinyActivityDefinition>>(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/${res8.data.Response.activities[0].activityDetails.directorActivityHash}/`, {
                            headers: {
                                'X-API-Key': global.Auth.destinyAPI,
                                'User-Agent': global.Auth.destinyUserAgent
                            }
                        })
                    }
                    if (res1.data.Response.characterActivities.data[Object.keys(res1.data.Response.characterActivities.data)[0]].currentActivityHash != 0) {
                        res10 = await axios.get<Destiny.ServerResponse<Destiny.DestinyActivityDefinition>>(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/${res1.data.Response.characterActivities.data[Object.keys(res1.data.Response.characterActivities.data)[0]].currentActivityHash}/`, {
                            headers: {
                                'X-API-Key': global.Auth.destinyAPI,
                                'User-Agent': global.Auth.destinyUserAgent
                            }
                        })
                    }
                    var race = "Unknown"
                    var userClass = "Unknown"
                    switch (res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].raceType) {
                        case Destiny.DestinyRace.Human:
                            race = "Human"
                            break
                        case Destiny.DestinyRace.Awoken:
                            race = "Awoken"
                            break
                        case Destiny.DestinyRace.Exo:
                            race = "Exo"
                            break
                    }
                    switch (res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].classType) {
                        case Destiny.DestinyClass.Titan:
                            userClass = "Titan"
                            break
                        case Destiny.DestinyClass.Hunter:
                            userClass = "Hunter"
                            break
                        case Destiny.DestinyClass.Warlock:
                            userClass = "Warlock"
                            break
                    }
                    embed = embed
                        .setTitle(args[2])
                        .setThumbnail(`https://bungie.net${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].emblemPath}`)
                        .addField("Race", race, true)
                        .addField("Class", userClass, true)
                        .addField("Subclass", itemManifest[subclass] != undefined ? itemManifest[subclass].displayProperties.name : "Unknown", true)
                        .addField("Light", `<:light:811725351587807313>${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].light}`, true)
                        .addField("Kinetic Weapon", itemManifest[kinetic] != undefined ? `[${itemManifest[kinetic].displayProperties.name}](https://light.gg/db/items/${kinetic})` : "None")
                        .addField("Energy Weapon", itemManifest[energy] != undefined ? `[${itemManifest[energy].displayProperties.name}](https://light.gg/db/items/${energy})`: "None")
                        .addField("Power Weapon", itemManifest[power] != undefined ? `[${itemManifest[power].displayProperties.name}](https://light.gg/db/items/${power})` : "None")
                        .addField("Ghost Shell", itemManifest[ghost] != undefined ? `[${itemManifest[ghost].displayProperties.name}](https://light.gg/db/items/${ghost})` : "None")
                        .addField("Vehicle", itemManifest[vehicle] != undefined ? `[${itemManifest[vehicle].displayProperties.name}](https://light.gg/db/items/${vehicle})` : "None")
                        .addField("Ship", itemManifest[ship] != undefined ? `[${itemManifest[ship].displayProperties.name}](https://light.gg/db/items/${ship})`: "None")
                        .addField("Latest Activity", res9.data == undefined ? "Unknown" : `[${res9.data.Response.displayProperties.name != "" ? res9.data.Response.displayProperties.name : "Unknown"}](https://destinytracker.com/destiny-2/db/activities/${res9.data.Response.hash})`, true)
                        .addField("Current Activity", res1.data.Response.characterActivities.data[Object.keys(res1.data.Response.characterActivities.data)[0]].currentActivityHash != 0 ? `[${res10.data.Response.displayProperties.name != "" ? res10.data.Response.displayProperties.name : "Unknown"}](https://destinytracker.com/destiny-2/db/activities/${res10.data.Response.hash})` : "User Offline", true)
                        .addField("Time Played", `${(Number(res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].minutesPlayedTotal) / 60).toFixed(1)} hours`, true)
                        .addField("Last Login", `${dateFormat(res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].dateLastPlayed, "mmmm dS, yyyy, h:MM:ss TT")} ${res1.data.Response.characterActivities.data[Object.keys(res1.data.Response.characterActivities.data)[0]].currentActivityHash != 0 ? "(currently in-game)" : ""}`, true)
                    interaction.editReply({content: "", embeds: [embed]})
                }
                else if (interaction2.customId == "stats") {
                    interaction.editReply("Gathering statistics information, please wait...")
                    const res2 = await axios.get<Destiny.ServerResponse<Destiny.DestinyHistoricalStatsAccountResult>>(`https://www.bungie.net/Platform/Destiny2/${res.data.Response[0].membershipType}/Account/${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].membershipId}/Stats/?groups=General`, {
                        headers: {
                            'X-API-Key': global.Auth.destinyAPI,
                            'User-Agent': global.Auth.destinyUserAgent
                        }
                    })
                    if (res2.data.Response.characters[0] == undefined) {
                        interaction.editReply({embeds: [global.Functions.BasicEmbed(("error"), "Unable to fetch stats for this player.")]})
                        return;
                    }
                    if (res2.data.Response.characters[0].results.allPvP.allTime != undefined) {
                        embed = embed
                            .setTitle(`${searchName.substring(0, searchName.length - 5)}'s PvP Stats`)
                            .setThumbnail(`https://bungie.net${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].emblemPath}`)
                            .addField("PvP Kills", res2.data.Response.characters[0].results.allPvP.allTime.kills.basic.value.toString(), true)
                            .addField("PvP Deaths", res2.data.Response.characters[0].results.allPvP.allTime.deaths.basic.value.toString(), true)
                            .addField("PvP Precision Kills", res2.data.Response.characters[0].results.allPvP.allTime.precisionKills.basic.value.toString(), true)
                            .addField("KDR", res2.data.Response.characters[0].results.allPvP.allTime.killsDeathsRatio.basic.displayValue, true)
                            .addField("Games Played", res2.data.Response.characters[0].results.allPvP.allTime.activitiesEntered.basic.value.toString(), true)
                            .addField("Games Won", res2.data.Response.characters[0].results.allPvP.allTime.activitiesWon.basic.value.toString(), true)
                    }
                    else {
                        embed = embed
                            .setTitle(`${searchName.substring(0, searchName.length - 5)}'s PvE Stats`)
                            .setThumbnail(`https://bungie.net${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].emblemPath}`)
                            .addField("PvE Kills", res2.data.Response.characters[0].results.allPvE.allTime.kills.basic.value.toString(), true)
                            .addField("PvE Deaths", res2.data.Response.characters[0].results.allPvE.allTime.deaths.basic.value.toString(), true)
                            .addField("PvE Precision Kills", res2.data.Response.characters[0].results.allPvE.allTime.precisionKills.basic.value.toString(), true)
                            .addField("Players Revived", res2.data.Response.characters[0].results.allPvE.allTime.resurrectionsPerformed.basic.value.toString(), true)
                            .addField("Public Events Completed", res2.data.Response.characters[0].results.allPvE.allTime.publicEventsCompleted.basic.value.toString(), true)
                    }
                    interaction.editReply({embeds: [embed]})
                }
                return;
            })

            return;

            /*
                else if (args[3].toLowerCase() == "stats") {
                    
                    m.edit({embeds: [embed]}).then(async m => {
                        if (res2.data.Response.characters[0].results.allPvP.allTime == undefined) {
                            return interaction.channel.send("Player PvP stats unavailable.")
                        }
                        page = 0
                        listen = true
                        m.react('⬅️')
                        m.react('➡️')
                        while (listen == true) {
                            const filter = (reaction: Discord.MessageReaction, user: Discord.User) => user.id === interaction.user.id;
                            await m.awaitReactions({filter, max: 1, time: 1.8e+6, errors: ['time']}).then(async c => {
                                if (c.first().emoji.name == "➡️") {
                                    if (page == 1) {
                                        return true
                                    }
                                    page++
                                }
                                else if (c.first().emoji.name == "⬅️") {
                                    if (page == 0) {
                                        return true
                                    }
                                    page--
                                }
                                m.reactions.removeAll()
                                m.react('⬅️')
                                m.react('➡️')
                                if (page == 1) {
                                    m.edit({embeds: [global.Functions.BasicEmbed("normal")
                                    .setTitle(`${args[2]}'s PvE Stats`)
                                    .setThumbnail(`https://bungie.net${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].emblemPath}`)
                                    .addField("PvE Kills", res2.data.Response.characters[0].results.allPvE.allTime.kills.basic.value.toString(), true)
                                    .addField("PvE Deaths", res2.data.Response.characters[0].results.allPvE.allTime.deaths.basic.value.toString(), true)
                                    .addField("PvE Precision Kills", res2.data.Response.characters[0].results.allPvE.allTime.precisionKills.basic.value.toString(), true)
                                    .addField("Players Revived", res2.data.Response.characters[0].results.allPvE.allTime.resurrectionsPerformed.basic.value.toString(), true)
                                    .addField("Public Events Completed", res2.data.Response.characters[0].results.allPvE.allTime.publicEventsCompleted.basic.value.toString(), true)]})
                                }
                                else {
                                    m.edit({embeds: [global.Functions.BasicEmbed("normal")
                                    .setTitle(`${args[2]}'s PvP Stats`)
                                    .setThumbnail(`https://bungie.net${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].emblemPath}`)
                                    .addField("PvP Kills", res2.data.Response.characters[0].results.allPvP.allTime.kills.basic.value.toString(), true)
                                    .addField("PvP Deaths", res2.data.Response.characters[0].results.allPvP.allTime.deaths.basic.value.toString(), true)
                                    .addField("PvP Precision Kills", res2.data.Response.characters[0].results.allPvP.allTime.precisionKills.basic.value.toString(), true)
                                    .addField("KDR", res2.data.Response.characters[0].results.allPvP.allTime.killsDeathsRatio.basic.displayValue, true)
                                    .addField("Games Played", res2.data.Response.characters[0].results.allPvP.allTime.activitiesEntered.basic.value.toString(), true)
                                    .addField("Games Won", res2.data.Response.characters[0].results.allPvP.allTime.activitiesWon.basic.value.toString(), true)]})
                                }
                                return true
                            })
                            .catch(c => {
                                m.reactions.removeAll()
                                return listen = false
                            })
                        }
                    })
                }
                else {
                    return m.edit({embeds: [global.Functions.BasicEmbed(("error"), "Please choose a valid return type: `general`, `stats`.")]})
                }
            })*/
        }
        else {
            return interaction.channel.send({embeds: [global.Functions.BasicEmbed(("error"), "Please choose a valid option: `item`, `player`.")]})
        }
    }
}