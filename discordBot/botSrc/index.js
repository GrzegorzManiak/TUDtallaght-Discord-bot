const discordJS = require('discord.js');

global.prefix = '.';
global.commands = {};

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

function commandHandler(message, hasPremissions = false, roles = []) {
    let charArray = message.content.split('');
    if (charArray[0] !== global.prefix) return;

    // Splits the message content up into words eg => a b c = ['a','b','c']
    let splitMessage = message.content.split(' ');

    //gives us the acutal command name by getting the first word and dropping the prefix character
    let command = global.commands[splitMessage[0].substring(1).toLowerCase()];

    //checks if the command requires a roll to execute.
    message.member.roles.cache.map(m => roles = [...roles, m.name]);

    if (command.roles !== undefined && command.roles.length > 0) {
        roles.forEach(hasRole => {
            if (command.roles.includes(hasRole)) hasPremissions = true;
        });
    } else hasPremissions = true;

    if (hasPremissions === false) message.channel.send(`${message.member} You dont have the sufficient privileges to execute this command.`);
    else if (command !== undefined) command.callbackFunction(splitMessage, message, roles)
}

// {
//  commandName: the name of the command, also used to actual call the command,
//  callbackFunction: must take one parameter, will be exectued when the user calls the command,
//  description: a short description on what the command dose.
//  roles: [] an array of all the roles that can use this command
// }
exports.addCommand = function addCommand(params = { commandName, description, callbackFunction, roles: [] }) {
    //Throw errors if not all required parameters are satisfied
    if (commands[params.commandName]) throw new Error('A command with that name already exists');
    if (params.commandName === undefined) throw new Error('No commandName provided');
    if (params.callbackFunction === undefined) throw new Error('No callbackFunction provided');

    global.commands[params.commandName] = params;
}