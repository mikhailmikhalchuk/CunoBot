module.exports = {
    name: "page",
    aliases: [],
    args: "<pageName|keyword>",
    desc: "Returns a link to the page with the given name on the wiki.",
    level: "0",
    func: async (message, args) => {
        if (args == "" || args == undefined) {
            message.channel.send(global.Functions.BasicEmbed(("error"), "Please enter the name of the page to search for."))
        }
        else {
            var pageName = args.join(' ')
            const status = await message.channel.send("Searching...")
            if (pageName.includes("@everyone") || pageName.includes("@here")) return status.edit("", global.Functions.BasicEmbed(("error"), "Please enter the name of a valid page."))
            else if (pageName.toLowerCase() == "github") return status.edit("https://github.com/MikhailMCraft/CunoBot")
            else {
                if (message.guild.id == "665580974364557322") return status.edit(`https://mad-city.fandom.com/${pageName.replace(/ /gi, "_")}`)
                else return false
            }
        }
    }
}