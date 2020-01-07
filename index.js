//includes
const Discord = require('discord.js');
const fs = require('fs');
const auth = require('./auth.json');

//global consts
const client = new Discord.Client();
let files = fs.readdirSync(__dirname + '/sounds');

// init conn as null 
var conn = null;
let commandRegex = '/^!askWub'
let numberRegex = RegExp('^\\d+$');
let textChannel = null;
let needToRec = null;

client.login(auth.token);

client.on('ready', () => {
	needToRec = true;
	console.log('I am ready!');
});

client.on('message', message => {
	if (message.author.bot) return;
	const args = message.content.split(/\s/);

	if (args[0] === '!wubinfo')
	{
		if (textChannel == null || conn == null) return;
		textChannel.send('!askwub - play a voice line at random \n' +
			'!askwub 0-' + (files.length-1) + ' - play a specific voice line by number \n' +
			'!count - get the total voice line count \n' +
			'!nightboss - boss goes night night');
	}

	// Connect to the senders current active voice channel, if there is one.
	if (args[0] === '!heyboss') {
		// Only try to join the senders voice channel if they are in one themselves
		GetVoiceConnection(message);
		if (conn != null)
			AskWub();
	}

	// Disconnect from current active voice channel, if there is one.
	if (args[0] === '!nightboss')
	{
		if(conn != null)
		{
			textChannel.send("Night boss! :cowboy:");
			conn.disconnect();
			conn = null;
			textChannel = null;
			needToRec = true;
		}
	}

	// Display the total number of voice responses
	if (args[0] === '!count')
	{
		message.reply('I have ' + files.length + ' responses available');
	}

	// play a random sound file 
	if (args.length < 2 && args[0] === '!askwub')
	{
		if (conn == null || needToRec)
		{
			return;
		}
		AskWub();
	}
	// play the sound file with the provided index if the index is valid
	else if (args.length == 2 && args[0] == '!askwub' && numberRegex.test(args[1]))
	{
		const index = parseInt(args[1]);
		if (conn == null || needToRec)
		{
			return;
		}
		if (index >= files.length) 
		{
			textChannel.send('invalid number, pick a number between 0 and ' + (files.length-1));
			return;
		}
		AskWubWithIndex(args[1]);
	}

	// check the sound folder for new additions since the bot has been running and update the count.
	if (message.content === '!updatefolder')
	{
		let old = files.length;
		files = fs.readdirSync(__dirname + '/sounds');
		message.reply("Updated sounds. Found " + (files.length - old ) + " new sounds. \n Count is now " + files.length);
	}
});

// play with a random index
AskWub = function() {
	const file = files[Math.floor(Math.random() * files.length)]
	const dispatcher = conn.playFile(__dirname + '/sounds/' + file.toString());
}

// play with a specified index
AskWubWithIndex = function(index) {
	const file = files[index];
	const dispatcher = conn.playFile(__dirname + '/sounds/' + file.toString());
}

// Connect to a Voice Channel and store the connection object and Text Channel, 
// if the sender is currently in a voice channel.
GetVoiceConnection = function(message) {
	if (message.member.voiceChannel) {
		message.member.voiceChannel.join()
			.then(connection => {
				conn = connection;
				textChannel = message.channel;
				textChannel.send('Sup nerds. :pinching_hand: \nType !wubinfo for commands');
				needToRec = false;
			})
			.catch(console.log);
	}
	else {
		message.reply('You need to join a voice channel first!');
		return;
	}
}