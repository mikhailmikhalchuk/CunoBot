import Discord from 'discord.js'

const userCooldown: any = {}

const normaljson: any = {0:"<:angrytoad:722917269209874446>", 1:"<:attackysack:722940712642936945>", 2:"<:attackybruh:722940706196553779>", 3:"<:chill:723198520626118657>", 4:"<:broshi:723198528196968528>", 5:"<:concerned:723198514770739290>", 6:"<:doh:723253419099554022>", 7:"<:goomba:723559972973314059>"}
const normaltextjson: any = {0:"**Angry Toad** (Normal)", 1:"**Attacky Sack** (Normal)", 2:"**Attacky Bruh** (Normal)", 3:"**Chill** (Normal)", 4:"**Broshi** (Normal)", 5:"**Concerned** (Normal)", 6:"**D'OH** (Normal)", 7:"**Goomba** (Normal)"}

const superjson: any = {0: "<:jazzmusicstops:722915370888855552>", 1:"<:veryrealmario:722915380061798511>", 2:"<:ahthatsagoodpointyes:722917261563658555>", 3:"<:attackysun:722940720297541662>", 4:"<:birb:723197669165760582>", 5:"<:comeonandclam:723253406000480330>", 6:"<:doomboom:723253425974018068>", 7:"<:kirby:678752912666787859>", 8:"<a:yahoo:765229954979069952>"}
const supertextjson: any = {0:"**Jazz Music Stops** (Super)", 1:"**Very Real Mario** (Super)", 2:"**Ah, That's A Good Point, Yes** (Super)", 3:"**Attacky Sun** (Super)", 4:"**Birb** (Super)", 5:"**Come on and Clam** (Super)", 6:"**Doom Boom** (Super)", 7:"**Kirby** (Super)", 8:"**Yahoo!** (Super)"}

const highendjson: any = {0:"<:aacc:722917254127419433>", 1:"<:banhammer:723197677038207006>", 2:"<:brian:723197665403469845>", 3:"<:dededenied:723253412514496564>", 4:"<:doorkick:683531808658554974>", 5:"<:luigidab:672224312908054538>", 6:"<a:YoshDance:716821647906045994>", 7:"<:buge:737708820565852222>", 8:"<a:confuseddog:765224327004028928>"}
const highendtextjson: any = {0:"**Aacc** (High-End)", 1:"**Ban Hammer** (High-End)", 2:"**Brian Flatulents** (High-End)", 3:"**Dededenied** (High-End)", 4:"**Doorkick** (High-End)", 5:"**Luigi Dab** (High-End)", 6:"**Yosh Dance** (High-End)", 7:"**Buge** (High-End)", 8:"**Confused Dog** (High-End)"}

module.exports = {
    name: "lootkong",
    aliases: [],
    desc: "Opens a Lootkong.",
    level: 3,
    func: async (message: Discord.Message) => {
        if (userCooldown[message.author.id] == false || userCooldown[message.author.id] == undefined || await global.Functions.getUserLevel(message.guild, message.member) == 3 || message.member.roles.cache.find(role => role.id === "725408238484324444") != undefined) {
            var random = Math.floor(Math.random() * 11)
            if (random == 8 || random == 9) {
                random = Math.floor(Math.random() * Object.keys(superjson).length)
                var emoji1 = superjson[random]
                var text1 = supertextjson[random]
                var type1 = `super${random}`
            }
            else if (random == 10) {
                random = Math.floor(Math.random() * Object.keys(highendjson).length)
                var emoji1 = highendjson[random]
                var text1 = highendtextjson[random]
                var type1 = `highend${random}`
            }
            else {
                random = Math.floor(Math.random() * Object.keys(normaljson).length)
                var emoji1 = normaljson[random]
                var text1 = normaltextjson[random]
                var type1 = `normal${random}`
            }
            random = Math.floor(Math.random() * 11)
            if (random == 8 || random == 9) {
                random = Math.floor(Math.random() * Object.keys(superjson).length)
                var emoji2 = superjson[random]
                var text2 = supertextjson[random]
                var type2 = `super${random}`
            }
            else if (random == 10) {
                random = Math.floor(Math.random() * Object.keys(highendjson).length)
                var emoji2 = highendjson[random]
                var text2 = highendtextjson[random]
                var type2 = `highend${random}`
            }
            else {
                random = Math.floor(Math.random() * Object.keys(normaljson).length)
                var emoji2 = normaljson[random]
                var text2 = normaltextjson[random]
                var type2 = `normal${random}`
            }
            const lootkong1 = await message.channel.send("\n<:dk1:722914445554352280><:dk2:722914439610892298>\n<:dk3:722914431809486910><:dk4:722914419239026729>")
            const lootkong2 = await message.channel.send("**Opening Lootkong...**\n_ _")
            setTimeout(() => {
                lootkong1.edit(`<:dk1:722914445554352280>${emoji1}<:dk2:722914439610892298>\n<:dk3:722914431809486910>${emoji2}<:dk4:722914419239026729>`)
                lootkong2.edit(`**Lootkong opened!**\nYou got:\n-${text1}\n-${text2}`)
            }, 2000)
            userCooldown[message.author.id] = true
            setTimeout(() => {userCooldown[message.author.id] = false}, 60000)
        }
        else if (userCooldown[message.author.id] == true) {
            return message.reply("you must wait 60 seconds before using this command again!")
        }
    }
}
