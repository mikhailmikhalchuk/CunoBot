module.exports = {
    name: "page",
    aliases: [],
    args: "<pageName>",
    desc: "Returns a link to the page with the given name on the wiki.",
    level: "0",
    func: async (message, args) => {
        var pageName = args.join(' ')
        if (pageName.toLowerCase() == "github") {
            return message.channel.send("https://github.com/MikhailMCraft/CunoBot")
        }
        else if (message.guild.id != "665580974364557322") {
            return false
        }
        else if (args == "" || args == undefined) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please enter the name of the page to search for."))
        }
        const status = await message.channel.send("Searching...")
        if (pageName.includes("@everyone") || pageName.includes("@here")) {
            return status.edit("", global.Functions.BasicEmbed(("error"), "Please enter the name of a valid page."))
        }
        return status.edit(`https://mad-city.fandom.com/${pageName.replace(/ /gi, "_")}`)
    }
}