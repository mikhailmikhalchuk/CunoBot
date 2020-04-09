module.exports = {
    name: "ping",
    aliases: [],
    desc: "Returns the speed at which the bot is functioning.",
    level: "0",
    func: (message) => {
        //Gets date
        const t = Date.now()
        //Sends the message
        message.channel.send("Pinging...").then(async (m) => {
            //Creates a new date and calculates time taken
            const ping = Math.round(Date.now() - t)
            m.edit("", global.Functions.BasicEmbed("normal")
                .setAuthor("Pong!")
                .addField("Bot Ping", `${Math.round(global.Client.ws.ping)} ms`)
                .addField("Server Ping", `${ping} ms`))
        })
    }
}