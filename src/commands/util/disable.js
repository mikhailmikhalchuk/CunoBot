module.exports = {
    name: "disable",
    aliases: [],
    desc: "Restricts bot commands to owner only.",
    level: "3",
    hidden: true,
    func: async (message) => {
        if (global.Disabled == true) {
            global.Disabled = false
            return message.channel.send("Returning to normal...")
        }
        global.Disabled = true
        return message.channel.send("Panicking...")
    }
}