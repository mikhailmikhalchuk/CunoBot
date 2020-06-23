const dateFormat = require('dateformat');

module.exports = {
    name: "kill",
    aliases: [],
    desc: "Disables the bot.",
    level: "3",
    hidden: true,
    func: async (message) => {
        const d = new Date();
        console.log(`Bot has disconnected.\nTaken offline at ${dateFormat(d, "h:MM:ss TT")}.`)
        message.channel.send("Terminating bot...").then(() => {
            Client.destroy()
            process.exit(0)
        })
    }
}