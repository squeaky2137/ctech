//import the required items from discord js
const { Discord, Client, Intents } = require("discord.js")
//import fs which is used to read files for cmd handler
const fs = require("fs")
//Create the client for the bot and required intents
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS
]})

//Catch any erros to prevent crashing using default js
process.on('unhandledRejection', error => {
	console.log('New ERROR:\n', error)
	console.log('error caught')
});


//----------------cmd handler------------------
//Create a collection of cmds / cmd files
client.commands = new Discord.Collection();

//get cmd folders
const commandFolders = fs.readdirSync('./commands');

//getting cmd files in subcmd folders
for (const folder of commandFolders) {
    //filtering to get the files
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter(file => file.endsWith('.js'));
    //running for each cmd file and defining values in collection
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

//ran on every msg to check for prefix and run cmds
client.on('messageCreate', async (message) => {
    const prefix = "."

    //stopping code if doesnt start with prefix or user is a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //defining args which will be an array of every value after the cmd and seperating every space
    const args = message.content.slice(prefix.length).split(/ +/);
    //getting cmd name
    const commandName = args.shift().toLowerCase();

    //checking if cmd / if cmd file
    const command = client.commands.get(commandName) || client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );
    if (!command) return;

    //running the cmd file
    try {
        command.run(message, args, Discord, client);
    } catch (error) {
        console.log(error)
    }
});

//------------------------------------------------------------------------------------------


//events *no event handler yet*

//ran once the bot is online only once. logging he is online
client.once('ready', () => {
    console.log('I am online!!!')
})









//Logging into the bot
client.login('tokenherecandle')