const dateFormat = require('dateformat');

module.exports = {
    name: "kill",
    aliases: ["destroy", "disable", "terminate"],
    desc: "Disables the bot.",
    level: "3",
    hidden: true,
    func: async (message) => {
        const d = new Date();
        const killtime = dateFormat(d, "h:MM:ss TT")
        console.log(`Bot has disconnected.\nTaken offline at ${killtime}.`)
        message.channel.send('Terminating bot...').then(() => {
            Client.destroy()
            process.exit(0)
        })
    }
}