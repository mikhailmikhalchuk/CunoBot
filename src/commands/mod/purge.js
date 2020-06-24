var toDelete = 0
var noDelete = 0

function getTimeDiff(datetime) {
    var datetime = typeof datetime !== 'undefined' ? datetime : "2014-01-01 01:02:03.123456";
    var datetime = new Date(datetime).getTime();
    const now = new Date().getTime();
    if (isNaN(datetime)) return "";
    if (datetime < now) var milisec_diff = now - datetime;
    else var milisec_diff = datetime - now;
    return Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
}

function oldMessages(message) {
    if (getTimeDiff(message.createdTimestamp) >= 14) {
        return noDelete = noDelete + 1
    }
    return toDelete = toDelete + 1
}

module.exports = {
    name: "purge",
    aliases: ["delete"],
    desc: "Bulk deletes messages.",
    args: "<#>",
    level: "1",
    func: (message, args) => {
        //Over 100
        if (Number(args[0]) >= 100) {
            message.delete()
            return message.channel.send(global.Functions.BasicEmbed(("error"), "You cannot purge more than 100 messages.")).then(msg => {msg.delete({timeout: 3000})})
        }
        //Success
        else if (args >= 1) {
            message.channel.messages.fetch({limit:Number(args[0] * 1 + 1)}).then((m) => {
                toDelete = 0
                noDelete = 0
                m.forEach(oldMessages)
                var messages = args[0] == 1 || toDelete == 2 ? "message" : "messages"
                if (getTimeDiff(m.last().createdTimestamp) >= 14 && toDelete == 1) {
                    return message.channel.send(global.Functions.BasicEmbed(("error"), "Cannot purge messages older than 14 days."))
                        .then(msg => {msg.delete({timeout: 3000})})
                }
                else if (getTimeDiff(m.last().createdTimestamp) >= 14) {
                    message.channel.bulkDelete(toDelete)
                    return message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully deleted ${toDelete - 1} ${messages}.\n${noDelete} could not be deleted.`))
                        .then(msg => {msg.delete({timeout: 3000})})
                }
                message.channel.bulkDelete(Number(args[0] * 1 + 1))
                message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully deleted ${Number(args[0])} ${messages}.`)
                    .setAuthor("Purged"))
                    .then(msg => {msg.delete({timeout: 3000})})
            })
        }
        //Under 1
        else if (typeof Number(args[0]) == "number" && args < 1) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), "You must assign an amount of messages to delete equal to or greater than 1."))
        }
        //Not a Number
        else if (isNaN(Number(args[0]))) {
            return message.channel.send(global.Functions.BasicEmbed(("error"), `${args[0]} is not a number!`))
        }
    }
}