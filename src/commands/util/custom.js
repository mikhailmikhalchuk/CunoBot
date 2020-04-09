module.exports = {
	name: "custom",
	prefix: "?",
	aliases: [],
	desc: "Executes a command set using ?setcustom.",
	level: "3",
	hidden: true,
	func: async (message, args) => {
		message.channel.send("Hello")
	}
}