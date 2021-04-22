const mcping = require("mcping-js");

module.exports = {
    name: "mcserver",
    aliases: [],
    desc: "Gets Minecraft server info.",
    args: "<serverAddress> [port]",
    level: "0",
    func: async (message, args) => {
        if (args == "" || args == undefined) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please provide a server address."))
        }
        if (typeof(args) != Number && args[1] != undefined && args[1] != "") {
            message.channel.send("Port is invalid, switching to 25565...")
        }
        new mcping.MinecraftServer(args[0], args[1] != "" && args[1] != undefined && typeof(args) == Number ? args[1] : 25565).ping(10000, 754, (err, res) => {
            if (err) {
                if (err.message == "read ECONNRESET" || err.message.startsWith("getaddrinfo ENOTFOUND")) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Could not reach the server. Ensure your server address and port are valid."))
                }
            }
            if (err) {
                return message.channel.send(global.Functions.BasicEmbed(("error"), err))
            }
            var embed = global.Functions.BasicEmbed("normal")
                .setTitle(args[0])
                .addField("Version", res.version.name, true)
                .addField("Players", `${res.players.online} / ${res.players.max}`, true)
            if (res.players.sample[0] != undefined) {
                var list = ""
                for (player in res.players.sample) {
                    list += `${res.players.sample[player].name}\n`
                }
                embed = embed
                    .addField("Player List", list)
            }
            else {
                embed = embed
                    .addField("Player List", "Too many players")
            }
            message.channel.send(embed)
        })
    }
}