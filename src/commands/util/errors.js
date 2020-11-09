module.exports = {
    name: "errors",
    aliases: [],
    desc: "Sends error file.",
    level: "3",
    func: (message) => {
        message.author.send({files: ['./errors.txt']});
    }
}