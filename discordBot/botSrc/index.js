const discordJS = require('discord.js');
let commands = {};

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
client.on("message", (message) => {
    commandHandler(message);
});

function commandHandler(message) {

}

// {
//  commandName: the name of the command, also used to actual call the command,
//  callbackFunction: must take one parameter, will be exectued when the user calls the command,
//  description: a short description on what the command dose.
// }
exports.addCommand = function addCommand(params = { commandName, description, callbackFunction }) {
    if (commands[params.commandName]) throw error('command already exists');
}