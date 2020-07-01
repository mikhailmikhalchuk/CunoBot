const userCooldown = {}

const normaljson = {0:"<:angrytoad:722917269209874446>", 1:"<:attackysack:722940712642936945>", 2:"<:attackybruh:722940706196553779>", 3:"<:chill:723198520626118657>", 4:"<:broshi:723198528196968528>", 5:"<:concerned:723198514770739290>", 6:"<:doh:723253419099554022>", 7:"<:goomba:678752553948938252>", 8:"<:doubt:672223839836569602>", 9:"<a:ThinkingBlooper:694749127191560192>", 10:"<a:impatience:715685095385727088>"}
const normaltextjson = {0:"**Angry Toad** (Normal)", 1:"**Attacky Sack** (Normal)", 2:"**Attacky Bruh** (Normal)", 3:"**Chill** (Normal)", 4:"**Broshi** (Normal)", 5:"**Concerned** (Normal)", 6:"**D'OH** (Normal)", 7:"**Goomba** (Normal)", 8:"**Doubt** (Normal)", 9:"**Thinking Blooper** (Normal)", 10:"**Impatience** (Normal)"}

const superjson = {0: "<:jazzmusicstops:722915370888855552>", 1:"<:veryrealmario:722915380061798511>", 2:"<:ahthatsagoodpointyes:722917261563658555>", 3:"<:attackysun:722940720297541662>", 4:"<:birb:723197669165760582>", 5:"<:comeonandclam:723253406000480330>", 6:"<:doomboom:723253425974018068>", 7:"<:kirby:678752912666787859>", 8:"<a:AAAAA:696535256689410160>"}
const supertextjson = {0:"**Jazz Music Stops** (Super)", 1:"**Very Real Mario** (Super)", 2:"**Ah, That's A Good Point, Yes** (Super)", 3:"**Attacky Sun** (Super)", 4:"**Birb** (Super)", 5:"**Come on and Clam** (Super)", 6:"**Doom Boom** (Super)", 7:"**Kirby** (Super)", 8:"**AAAAA** (Super)"}

const highendjson = {0:"<:aacc:722917254127419433>", 1:"<:banhammer:723197677038207006>", 2:"<:brian:723197665403469845>", 3:"<:dededenied:723253412514496564>", 4:"<:doorkick:683531808658554974>", 5:"<:luigidab:672224312908054538>", 6:"<a:YoshDance:716821647906045994>", 7:"<:buge:727952889754026084>"}
const highendtextjson = {0:"**Aacc** (High-End)", 1:"**Ban Hammer** (High-End)", 2:"**Brian Flatulents** (High-End)", 3:"**Dededenied** (High-End)", 4:"**Doorkick** (High-End)", 5:"**Luigi Dab** (High-End)", 6:"**Yosh Dance** (High-End)", 7:"**Buge** (High-End)"}

module.exports = {
    name: "lootkong",
    aliases: [],
    desc: "Opens a Lootkong.",
    level: "0",
    func: async (message) => {
        if (userCooldown[message.author.id] == false || userCooldown[message.author.id] == undefined || global.Functions.getUserLevel(message.guild.id, message.member) == 3 || message.member.roles.cache.find(role => role.id === "725408238484324444") != undefined) {
            switch (Math.floor(Math.random() * 11)) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    var random = Math.floor(Math.random() * Object.keys(normaljson).length)
                    var emoji1 = normaljson[random]
                    var text1 = normaltextjson[random]
                break
                case 8:
                case 9:
                    var random = Math.floor(Math.random() * Object.keys(superjson).length)
                    var emoji1 = superjson[random]
                    var text1 = supertextjson[random]
                break
                case 10:
                    var random = Math.floor(Math.random() * Object.keys(highendjson).length)
                    var emoji1 = highendjson[random]
                    var text1 = highendtextjson[random]
                break
                default:
                    var emoji1 = "error"
                    var text1 = "error"
                break
            }
            switch (Math.floor(Math.random() * 11)) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    var random = Math.floor(Math.random() * Object.keys(normaljson).length)
                    var emoji2 = normaljson[random]
                    var text2 = normaltextjson[random]
                break
                case 8:
                case 9:
                    var random = Math.floor(Math.random() * Object.keys(superjson).length)
                    var emoji2 = superjson[random]
                    var text2 = supertextjson[random]
                break
                case 10:
                    var random = Math.floor(Math.random() * Object.keys(highendjson).length)
                    var emoji2 = highendjson[random]
                    var text2 = highendtextjson[random]
                break
                default:
                    var emoji2 = "error"
                    var text2 = "error"
                break
            }
            const lootkong1 = await message.channel.send("Opening Lootkong...")
            const lootkong2 = await message.channel.send("\n<:dk1:722914445554352280><:dk2:722914439610892298>\n<:dk3:722914431809486910><:dk4:722914419239026729>")
            const lootkong3 = await message.channel.send("_ _")
            setTimeout(() => {
                lootkong1.edit("Lootkong opened!")
                lootkong2.edit(`<:dk1:722914445554352280>${emoji1}<:dk2:722914439610892298>\n<:dk3:722914431809486910>${emoji2}<:dk4:722914419239026729>`)
                lootkong3.edit(`You got:\n-${text1}\n-${text2}`)
            }, 2000)
            userCooldown[message.author.id] = true
            setTimeout(() => {userCooldown[message.author.id] = false}, 60000)
        }
        else if (userCooldown[message.author.id] == true) {
            return message.reply("you must wait 60 seconds before using this command again!")
        }
    }
}
