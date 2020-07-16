module.exports = {
    name: "ping",
    aliases: [],
    desc: "Returns the speed at which the bot is functioning.",
    level: "0",
    func: (message) => {
        const t = Date.now()
        message.channel.send("Pinging...").then(async (m) => {
            m.edit("", global.Functions.BasicEmbed("normal")
                .setAuthor("Pong!")
                .addField("Bot Ping", `${Math.round(global.Client.ws.ping)} ms`)
                .addField("Server Ping", `${Math.round(Date.now() - t)} ms`))
        })
    }
}