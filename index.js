//includes
const Discord = require('discord.js');
const fs = require('fs');
const auth = require('./auth.json');

//global consts
const client = new Discord.Client();
let files = fs.readdirSync(__dirname + '/sounds');

// init conn as null 
let conn = null;

client.login(auth.token);

client.on('ready', () => {
	console.log('I am ready!');
});

client.on('message', message => {
	if (message.content === '!info')
	{
		message.reply("Hey Boss UwU. Add me to your voice channel by typing !join after you've entered a voice channel yourself."
			+ '\n Type !askWub to get my opinion on something uwu.');
	}
	if (message.content === '!Heyboss') {
		// Only try to join the senders voice channel if they are in one themselves
		if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
				.then(connection => {
					conn = connection;
					message.reply('Hows it goin boss!');
				})
				.catch(console.log);
		}
		else {
			message.reply('You need to join a voice channel first!');
		}
	}
	if (message.content === '!count')
	{
		message.reply('I have ' + files.length + ' responses available');
	}

	if (message.content === '!askWub')
	{
		if (conn == null)
		{
			if (message.member.voiceChannel) {
				message.member.voiceChannel.join()
					.then(connection => {
						conn = connection;
					})
					.catch(console.log);
			}
			else {
				message.reply('You need to join a voice channel first!');
			}
		}
		const file = files[Math.floor(Math.random() * files.length)]
		const dispatcher = conn.playFile(__dirname + '/sounds/' + file.toString());
	}

	if (message.content === '!updateFolder')
	{
		let old = files.length;
		files = fs.readdirSync(__dirname + '/sounds');
		message.reply("Updated sounds. Found " + (files.length - old ) + " new sounds. \n Count is now " + files.length);
	}
});
