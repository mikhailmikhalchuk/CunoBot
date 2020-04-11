const Jimp = require('jimp')
const Discord = require('discord.js')

module.exports = {
    name: "invert",
    aliases: [],
    desc: "Inverts the colors of an image.",
    args: "<attached image>",
    level: "0",
    func: async (message, args) => {
        if (!args[0] && message.attachments.size < 1) {
            return message.channel.send(null, global.Functions.BasicEmbed('error', "Please provide an image or link to an image."))
        }
        const status = await message.channel.send("Inverting image...")
        Jimp.read(message.attachments.first() ? message.attachments.first().url : args[0]).then(d => {
            d.invert().getBufferAsync(Jimp.AUTO).then(async a => {
                await status.edit("Finished, sending to channel...")
                message.channel.send(new Discord.MessageAttachment(a)).then(() => {
                    status.edit("Finished.")
                })
            })
                .catch(e => {
                    if (e.message == undefined) {
                        return status.edit(null, global.Functions.BasicEmbed('error', e))
                    }
                    else if (e.message.startsWith("ENOENT:")) {
                        return status.edit(null, global.Functions.BasicEmbed('error', "Please provide an image or link to an image."))
                    }
                    else {
                        return status.edit(null, global.Functions.BasicEmbed('error', e))
                    }
                })
        })
            .catch(e => {
                if (e.message == undefined) {
                    return status.edit(null, global.Functions.BasicEmbed('error', e))
                }
                else if (e.message.startsWith("ENOENT:")) {
                    return status.edit(null, global.Functions.BasicEmbed('error', "Please provide an image or link to an image."))
                }
                else {
                    return status.edit(null, global.Functions.BasicEmbed('error', e))
                }
            })
    }
}