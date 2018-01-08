//https://discordapp.com/oauth2/authorize?&client_id=392805002269425684&scope=bot&permissions=0

console.log("Importing External Libraries");
const Discord = require("discord.js");
const colors = require("colors");
const fs = require("fs");
const Map = require("./data/maps/map").Map;
colors.setTheme({
	system: ['cyan'],
	info: ['green'],
	warning: ['yellow'],
	error: ['red']
});
console.log("Libraries Imported Successfully".system);
console.log();

var auth;
var commandsList;
var commandFunctions;
var admin;
var loadExternalFiles = function() {
	console.log("Loading External Files".system);
		auth = JSON.parse(fs.readFileSync("./data/auth.json"));
		commandsList = JSON.parse(fs.readFileSync("./data/commands/commands.json"));
		commandFunctions = require("./data/commands/commands.js");
		admin = JSON.parse(fs.readFileSync("./data/admin.json"));
	console.log("External Files Loaded".system);
	console.log();
}
loadExternalFiles();

console.log("Initializing Client".system);
var client = new Discord.Client();

var test = new Map("spawnland");

console.log(test.getName());

client.on("ready", () => {
	console.log("Discord Connection Successful".system);
	console.log("\tUsername: ".info + client.user.username);
	console.log("\tTag:      ".info + client.user.tag);
	console.log("\tID:       ".info + client.user.id);
	console.log("\tAvatar:   ".info + client.user.avatar);
	console.log();
});

client.on("message", message => {
	console.log("Recieved Message".system);
	if (message.author.id === client.user.id)
	{
		console.log("\tMessage is From Self".info);
		console.log("\tIgnoring".info);
		console.log();
		return;
	}
	if (message.channel.type !== "dm")
	{
		console.log("\tMessage is Not From a DM, Instead ".info + message.channel.type);
		console.log("\tIgnoring".info);
		console.log();
		return;
	}
	
	logMessage(message);
	
	var splitMsg = message.cleanContent.split(/[\s\n]+/);
	for (var i = 0; i < splitMsg.length; i++)
	{
		if (isCommand(splitMsg[i])) //is a command
		{
			console.log("\tSection of Message ".info + splitMsg[i] + " has Command Format".info);
			
			var afterCmd = splitMsg.slice(i + 1, splitMsg.length);
			
			commands(message, splitMsg[i], afterCmd);
		}
	}
	
	console.log();
	return;
});

var logMessage = function(message) {
	var msgID = "", content = "";
	var attachmentName = "", attachmentURL = "";
	var authorName = "", authorID = "";
	var guildName = "", guildID = "", channelName = "", channelID = "";
	var createdAt = "";
	
	msgID = message.id;
	content = message.cleanContent;
	if (message.attachments.array().length !== 0)
	{
		attachmentName = message.attachments.array()[0].filename;
		attachmentURL = message.attachments.array()[0].url;
	}
	else 
	{
		attachmentName = "NA";
		attachmentURL = "NA";
	}
	authorName = message.author.username;
	authorID = message.author.id;
	channelID = message.channel.id;
	createdAt = message.createdAt;
	if (message.channel.type === "dm")
	{
		guildName = "None";
		guildID = "DM";
		channelName = message.channel.recipient.username;
	}
	else if (message.channel.type === "group")
	{
		guildName = "None";
		guildID = "GroupDM";
		var members = message.channel.recipients.array();
		for (var i = 0; i < members.length; i++)
		{
			channelName += "@" + members[i].username;
			if (i !== members.length - 1) channelName += " ";
		}
	}
	else if (message.channel.type === "text")
	{
		guildName = message.guild.name;
		guildID = message.guild.id;
		channelName = message.channel.name;
	}
	else
	{
		console.log("\tChannel Type Not Accepted:".error);
		console.log("\t\t" + message.channel.type);
		console.log("\tCannot Log Message".error);
		return;
	}
	
	
	console.log("\tMessageID: ".info + msgID);
	console.log("\tContent: ".info);
	console.log("\t\t" + content);
	console.log("\tAttachment: ".info);
	console.log("\t\tFilename: ".info + attachmentName);
	console.log("\t\tURL:      ".info + attachmentURL);
	console.log("\tAuthor:     ".info + authorName + " (".info + authorID + ")".info);
	console.log("\tLocation: ".info);
	console.log("\t\tGuild:   ".info + guildName + " (".info + guildID + ")".info);
	console.log("\t\tChannel: ".info + channelName + " (".info + channelID + ")".info);
	console.log("\tCreated At: ".info + createdAt);
}

var isCommand = function(str) {
	return (str[0] === '!');
}

var isAdmin = function(user) {
	for (var i = 0; i < admin.admin.length; i++)
	{
		if (user.id === admin.admin[i])
		{
			return true;
		}
	}
	return false;
}

var commands = function(message, cmd, afterCmd) {
	cmd = cmd.slice(1, cmd.length);
	cmd = cmd.trim();
	cmd = cmd.toLowerCase();
	
	console.log("\tScanning for Commands to Match ".info + cmd);
	for (var i = 0; i < commandsList.commands.length; i++)
	{
		for (var i2 = 0; i2 < commandsList.commands[i].triggers.length; i2++)
		{
			if (cmd === commandsList.commands[i].triggers[i2]) //command matches
			{						
				console.log("\tFound Match!".info);
				
				if (commandsList.commands[i].adminOnly && !isAdmin(message.author))
				{
					console.log("\t\tCommand is Admin Only, and User is Not Admin".warning);
					console.log("\t\tSending Error Message to User".info);
					send(message.channel, "> That is an Admin Command, and you are not an Admin. Command Ignored.");
					break;
				}
				
				console.log("\t\tCalling Response Functions".info);
				
				for (var i3 = 0; i3 < commandsList.commands[i].responses.length; i3++)
				{
					console.log("\t\t\tCalling Function ".info + commandsList.commands[i].responses[i3]);
					
					commandFunctions[commandsList.commands[i].responses[i3]] ({
						
						client: client, 
						message: message, 
						cmd: cmd, 
						afterCmd: afterCmd,
						
						externalFiles: {
							auth: auth,
							commandsList: commandsList,
							commandFunctions: commandFunctions,
							admin: admin
						},
						
						functions: {
							loadExternalFiles: loadExternalFiles,
							logMessage: logMessage,
							isCommand: isCommand,
							isAdmin: isAdmin,
							send: send
						}
						
					});
				}

				break;
			}
		}
	}
}

var send = function(channel, content, options) {
	var guildName = "", guildID = "";
	var channelName = "";
	
	if (channel.type === "dm")
	{
		guildName = "None";
		guildID = "DM";
		channelName = channel.recipient.username;
	}
	else if (channel.type === "group")
	{
		guildName = "None";
		guildID = "GroupDM";
		var members = channel.recipients.array();
		for (var i = 0; i < members.length; i++)
		{
			channelName += "@" + members[i].username;
			if (i !== members.length - 1) channelName += " ";
		}
	}
	else if (channel.type === "text")
	{
		guildName = channel.guild.name;
		guildID = channel.guild.id;
		channelName = channel.name;
	}
	
	console.log("Sending Message".system);
		console.log("\tContent:".info)
			if (content.length > 50 || content.includes("\n") || content.includes("\t")) console.log("\t\t[Content cannot be properly printed due to length or formatting]".warning)
			else console.log("\t\t" + content);
		console.log("\tOptions:".info);
			console.log("\t\t" + JSON.stringify(options));
		console.log("\tTo:".info);
			console.log("\t\tGuild:   ".info + guildName + " (".info + guildID + ")".info);
			console.log("\t\tChannel: ".info + channelName + " (".info + channel.id + ")".info);
	console.log();
			
	channel.send(content, options).catch(err => {
		if (err != null)
		{ 
			console.log("Error Sending Message".error);
			console.log("\t" + err);
		}
	});
}

console.log("Attempting Connection to Discord".system);
client.login(auth.token);