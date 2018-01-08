module.exports = {
	help: function(args) {
		var commands = args.externalFiles.commandsList.commands;
		
		var basicMsg = "__**Basic Commands:**__\n";
		var adminMsg = "__**Admin Commands:**__\n";
		for (var i = 0; i < commands.length; i++)
		{
			var temp = "";
			temp += "\n\t- " + commands[i].name + " Command";
			if (!commands[i].complete) temp += " (Incomplete)"
			temp += "\n\t\t";
			for (var i2 = 0; i2 < commands[i].triggers.length; i2++)
			{
				temp += "!" + commands[i].triggers[i2];
				if (i2 < commands[i].triggers.length - 1) temp += ", ";
			}
			if (commands[i].description === "") temp += "\n\t\t*" + "[There is currently no description for this command. Contact the developers and ask them to add one.]" + "*";
			else temp += "\n\t\t*" + commands[i].description + "*";
			
			temp += "\n";
			
			if (commands[i].adminOnly)
			{
				adminMsg += temp;
			}
			else //if (!commands[i].adminOnly)
			{
				basicMsg += temp;
			}
		}
		
		args.functions.send(args.message.channel, basicMsg);
		if (args.functions.isAdmin(args.message.author))
		{
			args.functions.send(args.message.channel, adminMsg);
		}	
	},

	signup: function(args) {
		
	},
	
	reloadFiles: function(args) {
		args.functions.loadExternalFiles();
		args.functions.send(args.message.channel, "> External Files Reloaded");
	}
	
	
}