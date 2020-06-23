module.exports = {
    name: "updates",
    aliases: [],
    desc: "Grants or revokes the Bot Updates role (only functions in the official server).",
    level: "0",
    func: async (message) => {
        if (message.guild.id == "660857785566887976" && message.member.roles.cache.find(role => role.id === "722555137511653398") == undefined) {
            message.member.roles.add("722555137511653398")
            message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully added the Bot Updates role."))
        }
        else if (message.guild.id == "660857785566887976" && message.member.roles.cache.find(role => role.id === "722555137511653398") != undefined) {
            message.member.roles.remove("722555137511653398")
            message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully removed the Bot Updates role."))
        }
    }
}