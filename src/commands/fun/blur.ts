import Jimp from "jimp"
import Discord from "discord.js"

module.exports = {
    name: "blur",
    aliases: [],
    desc: "Blurs an image.",
    args: "<image|link>",
    level: 0,
    func: async (message: Discord.Message, args: string[]) => {
        if (!args[0] && message.attachments.size < 1) {
            return message.channel.send(null, global.Functions.BasicEmbed('error', "Please provide an image or link to an image."))
        }
        const status = await message.channel.send("Blurring...")
        Jimp.read(message.attachments.first() ? message.attachments.first().url : args[0]).then(d => {
            d.blur(6).getBufferAsync(Jimp.AUTO.toString()).then(async a => {
                await status.edit("Finished, sending to channel...")
                message.channel.send(new Discord.MessageAttachment(a)).then(a => {
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