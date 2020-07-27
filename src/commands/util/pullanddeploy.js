module.exports = {
    name: "pullanddeploy",
    aliases: [],
    desc: "Performs a Git pull and redeploys the bot",
    level: "3",
    hidden: true,
    func: (message, args) => {
        message.channel.send("fetching updates...").then(function(sentMsg){
			console.log("updating...");
			var spawn = require('child_process').spawn;
			var log = function(err,stdout,stderr){
				if(stdout){console.log(stdout);}
				if(stderr){console.log(stderr);}
			};
			var fetch = spawn('git', ['fetch']);
			fetch.stdout.on('data',function(data){
				console.log(data.toString());
			});
			fetch.on("close",function(code){
				var reset = spawn('git', ['reset','--hard','origin/master']);
				reset.stdout.on('data',function(data){
					console.log(data.toString());
				});
				reset.on("close",function(code){
					var npm = spawn('npm', ['install']);
					npm.stdout.on('data',function(data){
						console.log(data.toString());
					});
					npm.on("close",function(code){
						console.log("goodbye");
						sentMsg.edit("brb!").then(function(){
							bot.destroy().then(function(){
								process.exit();
							});
						});
					});
				});
			});
		});
    }
}