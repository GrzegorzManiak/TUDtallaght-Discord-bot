const discordJS = require('discord.js');
let commands = {},
    prefix = '.';

const client = new discordJS.Client({
    intents: [
        discordJS.Intents.FLAGS.GUILDS, //Give the bot access to its connected guilds, should only be one tho.
        discordJS.Intents.FLAGS.GUILD_MESSAGES //Give it the ability to see incoming messages.
    ]
});

//Authenticate the bot
client.login(global.discord);

//confirm that the bot authenticated
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}, ${client.user.id}!`);
});

//triggers everytime a message is sent.
client.on('messageCreate', (message) => {
    commandHandler(message);
});

function commandHandler(message) {
    let charArray = message.content.split('');
    if (charArray[0] !== prefix) return;

    let splitMessage = message.content.split(' ');

    let command = commands[splitMessage[0].substring(1).toLowerCase()]; //gives us the acutal command name
    splitMessage.splice(0, 1); //Remove the initiator, aka the command being called

    if (command !== undefined) command.callbackFunction([...splitMessage, message])
}

// {
//  commandName: the name of the command, also used to actual call the command,
//  callbackFunction: must take one parameter, will be exectued when the user calls the command,
//  description: a short description on what the command dose.
// }
exports.addCommand = function addCommand(params = { commandName, description, callbackFunction }) {
    //Throw errors if not all required parameters are satisfied
    if (commands[params.commandName]) throw new Error('A command with that name already exists');
    if (params.commandName === undefined) throw new Error('No commandName provided');
    if (params.callbackFunction === undefined) throw new Error('No callbackFunction provided');

    commands[params.commandName] = params;
}

exports.setPrefix = function setPrefix(inp) { prefix = inp; };