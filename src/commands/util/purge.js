const dateFormat = require('dateformat');

function get_time_diff( datetime )
{
    var datetime = typeof datetime !== 'undefined' ? datetime : "2014-01-01 01:02:03.123456";

    var datetime = new Date( datetime ).getTime();
    var now = new Date().getTime();

    if( isNaN(datetime) )
    {
        return "";
    }

    if (datetime < now) {
        var milisec_diff = now - datetime;
    }
    else{
        var milisec_diff = datetime - now;
    }

    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
    return days
}

module.exports = {
    name: "purge",
    aliases: ["delete"],
    desc: "Bulk deletes messages.",
    args: "<#>",
    level: "1",
    func: (message, args) => {
        //Success
        if (args >= 1) {
            if (args == 1) {messages = "message"}
            else {messages = "messages"}
            message.channel.messages.fetch({limit:Number(args[0] * 1 + 1)}).then((m) => {
                if (get_time_diff(m.last().createdTimestamp) >= 14) {
                    message.delete()
                    message.channel.send(global.Functions.BasicEmbed(("error"), "Cannot purge messages older than 14 days."))
                        .then(msg => {
                            msg.delete({timeout: 3000})
                        })
                }
                else {
                    try {
                        message.channel.bulkDelete(Number(args[0] * 1 + 1))
                        message.channel.send(global.Functions.BasicEmbed(("success"), `Successfully deleted ${Number(args[0])} ${messages}.`)
                            .setAuthor("Purged"))
                            .then(msg => {
                                msg.delete({timeout: 3000})
                            })
                    }
                    catch (e) {
                        message.channel.send(global.Functions.BasicEmbed(("error"), e))
                    }
                }
            })
        }
        //Under 1
        else if (typeof Number(args[0]) == "number" && args < 1) {
            message.channel.send(global.Functions.BasicEmbed(("error"), "You must assign an amount of messages to delete equal to, or greater than, 1."))
        }
        //Not a Number
        else if (isNaN(Number(args[0]))) {
            message.channel.send(global.Functions.BasicEmbed(("error"), `${args[0]} is not a number!`))
        }
    }
}