import Discord from 'discord.js'
const dateFormat = require('dateformat');

module.exports = {
    name: "kill",
    aliases: [],
    desc: "Forces a bot disconnection and terminates the process.",
    level: 3,
    hidden: true,
    func: async (message: Discord.Message) => {
        const d = new Date();
        console.log(`Bot has disconnected.\nTaken offline at ${dateFormat(d, "h:MM:ss TT")}.`)
        message.channel.send("Terminating bot...").then(() => {
            global.Client.destroy()
            process.exit(0)
        })
    }
}