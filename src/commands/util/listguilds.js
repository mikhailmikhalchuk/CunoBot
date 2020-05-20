var serverlist = []

function listthem(server) {
    serverlist.push(server.name)
}

module.exports = {
    name: "listguilds",
    aliases: ["listservers", "servers"],
    desc: "Lists all servers the bot is in.",
    level: "3",
    hidden: true,
    func: async (message, args) => {
        serverlist.splice(0)
        global.Client.guilds.cache.forEach(listthem)
        message.channel.send(global.Functions.BasicEmbed("normal")
        .setAuthor("Servers")
        .setDescription(serverlist.toString().replace(/,/g, "\n")))
    }
}