const axios = require('axios');
const dateFormat = require("dateformat");
var listen = true
var page = 0

module.exports = {
    name: "destiny",
    aliases: [],
    args: "<item|player> <keyword(s)|platform> <player>",
    desc: "Queries the Destiny API.",
    level: "0",
    func: async (message, args) => {
        if (args[0] == undefined) {
            return message.channel.send(global.Functions.BasicEmbed('error', "Please choose a valid option: `item`, `player`."))
        }
        if (args[0].toLowerCase() == "item") {
            listen = false
            page = 0
            var embed = global.Functions.BasicEmbed("normal")
            if (args[1] == undefined) {
                return message.channel.send(global.Functions.BasicEmbed('error', "Please provide keyword(s) to search with."))
            }
            const res = await axios.get(`https://www.bungie.net/Platform/Destiny2/Armory/Search/DestinyInventoryItemDefinition/${args.slice(1).join(" ")}/`, {
                headers: {
                    'X-API-Key': global.Auth.destinyAPI,
                    'User-Agent': global.Auth.destinyUserAgent
                }
            })
            if (res.data.Response.results.totalResults == 0) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), `No results found.${res.data.Response.suggestedWords[0] != undefined ? `\nRecommended keywords to search with: \`${res.data.Response.suggestedWords.join(", ")}\`` : ""}`))
            }
            var res1 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${String(res.data.Response.results.results[0].hash)}/`, {
                headers: {
                    'X-API-Key': global.Auth.destinyAPI,
                    'User-Agent': global.Auth.destinyUserAgent
                }
            })
            if (res1.data.Response.itemType == 3) {
                embed = embed
                    .setAuthor(`${res.data.Response.results.results[0].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                    .setDescription(`*${res1.data.Response.flavorText != "" ? res1.data.Response.flavorText : res1.data.Response.displayProperties.description != "" ? res1.data.Response.displayProperties.description : "No description provided"}*`)
                    .addField("Tier", res1.data.Response.inventory.tierTypeName, true)
                    .addField("Impact", res1.data.Response.stats.stats['4043523819'].value, true)
                    .addField("Range", res1.data.Response.stats.stats['1240592695'].value, true)
                    .addField("Magazine Size", res1.data.Response.stats.stats['3871231066'].value, true)
                    .setImage(`https://www.bungie.net${res.data.Response.results.results[0].displayProperties.icon}`, true)
            }
            else {
                embed = embed
                    .setAuthor(`${res.data.Response.results.results[0].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                    .setDescription(`*${res1.data.Response.flavorText != "" ? res1.data.Response.flavorText : res1.data.Response.displayProperties.description != "" ? res1.data.Response.displayProperties.description : "No description provided"}*`)
                    .addField("Tier", res1.data.Response.inventory.tierTypeName, true)
                    .setImage(`https://www.bungie.net${res.data.Response.results.results[0].displayProperties.icon}`, true)
            }
            message.channel.send(embed).then(async m => {
                listen = true
                m.react('⬅️')
                m.react('➡️')
                while (listen == true) {
                    await m.awaitReactions((reaction, user) => user.id === '287372868814372885', {max: 1, time: 1.8e+6, errors: ['time']}).then(async c => {
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
                        if (message.guild.me.permissions.any("ADMINISTRATOR") == true) {
                            m.reactions.removeAll()
                            m.react('⬅️')
                            m.react('➡️')
                        }
                        res1 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${String(res.data.Response.results.results[page].hash)}/`, {
                            headers: {
                                'X-API-Key': global.Auth.destinyAPI,
                                'User-Agent': global.Auth.destinyUserAgent
                            }
                        })
                        if (res1.data.Response.itemType == 3) {
                            m.edit("", global.Functions.BasicEmbed("normal")
                                .setAuthor(`${res.data.Response.results.results[0].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                                .setDescription(`*${res1.data.Response.flavorText != "" ? res1.data.Response.flavorText : res1.data.Response.displayProperties.description != "" ? res1.data.Response.displayProperties.description : "No description provided"}*`)
                                .addField("Tier", res1.data.Response.inventory.tierTypeName, true)
                                .addField("Impact", res1.data.Response.stats.stats['4043523819'].value, true)
                                .addField("Range", res1.data.Response.stats.stats['1240592695'].value, true)
                                .addField("Magazine Size", res1.data.Response.stats.stats['3871231066'].value, true)
                                .setImage(`https://www.bungie.net${res.data.Response.results.results[page].displayProperties.icon}`, true))
                        }
                        else {
                            m.edit("", global.Functions.BasicEmbed("normal")
                            .setAuthor(`${res.data.Response.results.results[0].displayProperties.name} (result: ${page + 1}/${res.data.Response.results.totalResults})`)
                            .setDescription(`*${res1.data.Response.flavorText != "" ? res1.data.Response.flavorText : res1.data.Response.displayProperties.description != "" ? res1.data.Response.displayProperties.description : "No description provided"}*`)
                            .addField("Tier", res1.data.Response.inventory.tierTypeName, true)
                            .setImage(`https://www.bungie.net${res.data.Response.results.results[page].displayProperties.icon}`, true))
                        }
                        return true
                    })
                    .catch(c => {
                        if (message.guild.me.permissions.any("ADMINISTRATOR") == true) {
                            m.reactions.removeAll()
                        }
                        return listen = false
                    })
                }
            })
        }
        else if (args[0].toLowerCase() == "player") {
            message.channel.send("Gathering information, please wait...").then(async m => {
                if (args[1] == undefined) {
                    return m.edit("", global.Functions.BasicEmbed(("error"), "Please choose a valid platform: `xbox`, `psn`, `steam`, `stadia`."))
                }
                if (args[1].toLowerCase() != "xbox" && args[1].toLowerCase() != "psn" && args[1].toLowerCase() != "steam" && args[1].toLowerCase() != "stadia") {
                    return m.edit("", global.Functions.BasicEmbed(("error"), "Please choose a valid platform: `xbox`, `psn`, `steam`, `stadia`."))
                }
                const res = await axios.get(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/Tiger${args[1].toLowerCase().charAt(0).toUpperCase() + args[1].toLowerCase().slice(1)}/${args[2]}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                if (res.data.Response[0] == undefined) {
                    return m.edit("", global.Functions.BasicEmbed(("error"), "Could not find user."))
                }
                const res1 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Tiger${args[1].toLowerCase().charAt(0).toUpperCase() + args[1].toLowerCase().slice(1)}/Profile/${res.data.Response[0].membershipId}/?components=CharacterEquipment,Characters,CharacterActivities`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                const res2 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[0].itemHash}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                const res3 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[1].itemHash}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                const res4 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[2].itemHash}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                const res5 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[8].itemHash}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                const res6 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[9].itemHash}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                const res7 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[10].itemHash}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                const res8 = await axios.get(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/${res1.data.Response.characterActivities.data[Object.keys(res1.data.Response.characterActivities.data)[0]].currentActivityHash}`, {
                    headers: {
                        'X-API-Key': global.Auth.destinyAPI,
                        'User-Agent': global.Auth.destinyUserAgent
                    }
                })
                var embed = global.Functions.BasicEmbed("normal")
                var race = "Unknown"
                var userClass = "Unknown"
                var subclass = "Unknown"
                switch (res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].raceType) {
                    case 0:
                        race = "Human"
                        break
                    case 1:
                        race = "Awoken"
                        break
                    case 2:
                        race = "Exo"
                        break
                }
                switch (res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].classType) {
                    case 0:
                        userClass = "Titan"
                        break
                    case 1:
                        userClass = "Hunter"
                        break
                    case 2:
                        userClass = "Warlock"
                        break
                }
                for (var item of res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items) {
                    switch (item.itemHash) {
                        case 3382391785:
                            subclass = "Sentinel"
                            break
                        case 2958378809:
                            subclass = "Striker"
                            break
                        case 3105935002:
                            subclass = "Sunbreaker"
                            break
                        case 613647804:
                            subclass = "Behemoth"
                            break
                        case 447268699:
                            subclass = "Dawnblade"
                            break
                        case 3887892656:
                            subclass = "Voidwalker"
                            break
                        case 4044254684:
                            subclass = "Stormcaller"
                            break
                        case 3291545503:
                            subclass = "Shadebinder"
                            break
                        case 3635991036:
                            subclass = "Gunslinger"
                            break
                        case 1334959255:
                            subclass = "Arcstrider"
                            break
                        case 3225959819:
                            subclass = "Nightstalker"
                            break
                        case 873720784:
                            subclass = "Revenant"
                            break
                    }
                }
                embed = embed
                    .setAuthor(args[2], `https://bungie.net${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].emblemPath}`)
                    .addField("Race", race, true)
                    .addField("Class", userClass, true)
                    .addField("Subclass", subclass, true)
                    .addField("Light", `<:light:811725351587807313>${res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].light}`, true)
                    .addField("Kinetic Weapon", `${res2.data.Response.itemType == 3 ? `[${res2.data.Response.displayProperties.name}](https://light.gg/db/items/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[0].itemHash})` : "None"}`)
                    .addField("Energy Weapon", `${res3.data.Response.itemType == 3 ? `[${res3.data.Response.displayProperties.name}](https://light.gg/db/items/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[1].itemHash})` : "None"}`)
                    .addField("Power Weapon", `${res4.data.Response.itemType == 3 ? `[${res4.data.Response.displayProperties.name}](https://light.gg/db/items/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[2].itemHash})` : "None"}`)
                    .addField("Ghost Shell", `${res5.data.Response.itemType == 24 ? `[${res5.data.Response.displayProperties.name}](https://light.gg/db/items/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[8].itemHash})` : "None/Unknown"}`)
                    .addField("Vehicle", `${res6.data.Response.itemType == 22 ? `[${res6.data.Response.displayProperties.name}](https://light.gg/db/items/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[9].itemHash})` : "None/Unknown"}`)
                    .addField("Ship", `${res7.data.Response.itemType == 21 ? `[${res7.data.Response.displayProperties.name}](https://light.gg/db/items/${res1.data.Response.characterEquipment.data[Object.keys(res1.data.Response.characterEquipment.data)[0]].items[10].itemHash})` : "None/Unknown"}`)
                    .addField("Activity", `${res8.data.Response == undefined ? "User Offline" : res8.data.Response.displayProperties.name != "" ? res8.data.Response.displayProperties.name : "Private"}`)
                    .addField("Time Played", `${(res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].minutesPlayedTotal/60).toFixed(2)} hours`, true)
                    .addField("Last Login", dateFormat(res1.data.Response.characters.data[Object.keys(res1.data.Response.characters.data)[0]].dateLastPlayed, "mmmm dS, yyyy, h:MM:ss TT"), true)
                m.edit("", embed)
            })
        }
        else {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please choose a valid option: `item`, `player`."))
        }
    }
}