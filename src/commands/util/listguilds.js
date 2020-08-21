const serverList = []

module.exports = {
    name: "listguilds",
    aliases: ["listservers", "servers"],
    desc: "Lists all servers the bot is in.",
    level: "3",
    hidden: true,
    func: async (message) => {
        serverList.splice(0)
        global.Client.guilds.cache.forEach(server => serverList.push(server.name))
        message.channel.send(global.Functions.BasicEmbed("normal")
        .setAuthor("Servers")
        .setDescription(serverList.toString().replace(/,/g, "\n")))
    }
}