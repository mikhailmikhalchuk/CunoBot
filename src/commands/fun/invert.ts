import Jimp from "jimp"
import Discord from "discord.js"

module.exports = {
    name: "invert",
    aliases: [],
    desc: "Inverts the colors of an image.",
    args: "<image|link>",
    level: 0,
    func: async (message: Discord.Message, args: string[]) => {
        if (!args[0] && message.attachments.size < 1) {
            return message.channel.send(null, global.Functions.BasicEmbed('error', "Please provide an image or link to an image."))
        }
        const status = await message.channel.send("Inverting image...")
        Jimp.read(message.attachments.first() ? message.attachments.first().url : args[0]).then(d => {
            d.invert().getBufferAsync(Jimp.AUTO.toString()).then(async a => {
                await status.edit("Finished, sending to channel...")
                message.channel.send(new Discord.MessageAttachment(a)).then(() => {
                    status.edit("Finished.")
                })
                .catch(e => {
                    return status.edit(null, global.Functions.BasicEmbed('error', e))
                })
            })
            .catch(e => {
                if (e.message == undefined) {
                    return status.edit(null, global.Functions.BasicEmbed('error', e))
                }
                else if (e.message.startsWith("ENOENT:")) {
                    return status.edit(null, global.Functions.BasicEmbed('error', "Please provide an image or link to an image."))
                }
                return status.edit(null, global.Functions.BasicEmbed('error', e))
            })
        })
        .catch(e => {
            if (e.message == undefined) {
                return status.edit(null, global.Functions.BasicEmbed('error', e))
            }
            else if (e.message.startsWith("ENOENT:")) {
                return status.edit(null, global.Functions.BasicEmbed('error', "Please provide an image or link to an image."))
            }
            return status.edit(null, global.Functions.BasicEmbed('error', e))
        })
    }
}