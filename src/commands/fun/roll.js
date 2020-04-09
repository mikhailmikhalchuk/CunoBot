module.exports = {
    name: "roll",
    aliases: ["dice"],
    desc: "Rolls a die, with the amount of sides decided by the user. Defaults to 6.",
    args: "[sides]",
    level: "0",
    func: async (message, args) => {
        //Undefined - Set roll to 6
        var roll = args[0]
        if (!roll) roll = 6
        //Start roll
        const m = await message.channel.send(global.Functions.BasicEmbed(("normal"), " ")
            .setAuthor("Rolling...")
            .addField("Sides", roll))
        //Not a Number
        if (isNaN(Number(roll))) {
            return m.edit(global.Functions.BasicEmbed(("error"), `${roll} is not a number!`))
        }
        //Under 1
        if (Number(roll) <= 0) {
            return m.edit(global.Functions.BasicEmbed(("error"), "Please pick a number greater than one."))
        }
        //Infinity
        if (roll == Infinity) {
            return m.edit(global.Functions.BasicEmbed(("error"), "You cannot roll infinity!"))
        }
        //Is 1
        if (Number(roll) == 1) {
            return m.edit(global.Functions.BasicEmbed(("error"), "Please pick a number greater than one."))
        }
        //Is a decimal
        if (Number.isInteger(roll * 1) == false) {
            return m.edit(global.Functions.BasicEmbed(("error"), "Please pick a whole number."))
        }
        //Pass checks - return result
        setTimeout(function () {
            m.edit(global.Functions.BasicEmbed("success")
                .setAuthor("Rolled")
                .addField("Sides", roll)
                .addField("Result", Math.ceil(Math.random() * roll)))
        }, 1500)
    }
}