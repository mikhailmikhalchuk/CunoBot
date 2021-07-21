import Discord from 'discord.js'
const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient(global.Auth.dbLogin, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
    name: "mute",
    aliases: [],
    desc: "Mutes a user.",
    args: "<@mention|username>",
    level: 1,
    func: async (message: Discord.Message, args: string[]) => {
        await mongoClient.connect()
        const check = await mongoClient.db("Servers").collection("Muted Roles").findOne({server: message.guild.id})
        mongoClient.close()
        var getRole = message.guild.roles.cache.find(role => role.name === "Cuno's Bot").position
        const memberData = global.Functions.getMember(message, args.join(' '))
        if (!memberData[0]) {
            return message.channel.send(null, global.Functions.BasicEmbed("error", memberData[1]))
        }
        const member: Discord.GuildMember = memberData[1]
        if (!member) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "No users found!"))
        }
        else if (args[0] == undefined || args[0] == "") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Please specify the user to mute."))
        }
        if (message.member.roles.highest.position <= member.roles.highest.position && message.author.id != message.guild.ownerID) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "Cannot mute users ranked the same or higher than you."))
        }
        if (check == undefined) {
            const mutechat = await message.channel.send("No muted role detected, creating one...")
            message.guild.roles.create({data: {name: 'Muted', color: 'GRAY', position: getRole, permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'CONNECT']}, reason: 'No existing muted role'}).then((r) => {
                mutechat.edit("Successfully created muted role.")
                message.guild.members.resolve(member).roles.add(r.id, "Mute command used").then(async () => {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Muted Roles").insertOne({server: message.guild.id, role: r.id})
                    mongoClient.close()
                    return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully muted user."))
                })
            })
        }
        else if (message.guild.roles.cache.find(role => role.id === check["role"]) == undefined) {
            const mutechat = await message.channel.send("Couldn't find muted role in this server from database, creating one...")
            message.guild.roles.create({data: {name: 'Muted', color: 'GRAY', position: getRole, permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'CONNECT']}, reason: 'No existing muted role'}).then((r) => {
                mutechat.edit("Successfully created muted role.")
                message.guild.members.resolve(member).roles.add(r.id, "Mute command used").then(async () => {
                    await mongoClient.connect()
                    await mongoClient.db("Servers").collection("Muted Roles").updateOne({server: message.guild.id}, {$set: {role: r.id}})
                    mongoClient.close()
                    return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully muted user."))
                })
            })
        }
        else if (member.roles.cache.find(role => role.id === check["role"]) != undefined) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "User already muted."))
        }
        else if (member.user.id == "660856814610677761") {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "You can't mute me!"))
        }
        else {
            message.guild.members.resolve(member).roles.add(check["role"], "Mute command used").then(() => {
                return message.channel.send(global.Functions.BasicEmbed(("success"), "Successfully muted user."))
            })
            .catch((e) => {
                if (e.message == "Missing Permissions") {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "The muted role is above my role in this server's role hierarchy.\nPlease move it below my role and try again."))
                }
            })
        }
    }
}