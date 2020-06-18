module.exports = {
    name: "userpage",
    aliases: [],
    args: "<pageName|keyword>",
    desc: "Returns a link to a user's page on the wiki.",
    level: "0",
    func: async (message, args) => {
        if (args == "" || args == undefined) {
            message.channel.send(global.Functions.BasicEmbed(("error"), "Please enter the name of the user to search for."))
        }
        else {
            var pageName = args.join(' ')
            const status = await message.channel.send("Searching...")
            if (pageName.includes("@everyone") || pageName.includes("@here")) return status.edit("", global.Functions.BasicEmbed(("error"), "Please enter the name of a valid page."))
            else {
                if (message.guild.id == "665580974364557322") return status.edit(`https://mad-city.fandom.com/wiki/User:${pageName.replace(/ /gi, "_")}`)
                else return false
            }
        }
    }
}