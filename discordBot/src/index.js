const discordJS = require('discord.js');
const client = new discordJS.Client({
    intents: [
        discordJS.Intents.FLAGS.GUILDS, //Give the bot access to its connected guilds, should only be one tho.
        discordJS.Intents.FLAGS.GUILD_MESSAGES, //Give it the ability to see incoming messages.
        discordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS //Gives the bot the ability to check for and add reactions
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});


global.prefix = '.';
global.commands = {};
global.client = client;

//Authenticate the bot
client.login(global.discord);

//confirm that the bot authenticated
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}, ${client.user.id}!`);
});

function getUserRolesFromMessage(message, roles = []) {
    message.member.roles.cache.map(m => roles = [...roles, m.name]);
    return roles;
}

//checks if the user has sufficient privileges to preform an action.
function checkPermisions(roles, command, pass = false) {
    if (command !== undefined && command.roles !== undefined && command.roles.length > 0) {
        roles.forEach(hasRole => {
            if (command.roles.includes(hasRole) === true) pass = true;
        });
    } else pass = true;
    return pass;
}

//triggers everytime a message is sent.
client.on('messageCreate', async(message) => {
    commandHandler(message);
});

function commandHandler(message) {
    let charArray = message.content.split('');
    if (charArray[0] !== global.prefix) return;

    // Splits the message content up into words eg => a b c = ['a','b','c']
    let splitMessage = message.content.split(' ');

    //gives us the acutal command name by getting the first word and dropping the prefix character
    let command = global.commands[splitMessage[0].substring(1).toLowerCase()],
        userRoles = getUserRolesFromMessage(message),
        hasPremissions = checkPermisions(userRoles, command);

    if (hasPremissions === false) message.channel.send(`${message.member} You dont have the sufficient privileges to execute this command.`);
    else if (command !== undefined) command.callbackFunction(splitMessage, message, userRoles)
}

//triggers everytime a reaction is added to a msg sent from the bot
client.on('messageReactionAdd', async(reaction, user) => {
    reactionHandler(reaction, user, false);
});

async function reactionHandler(reaction, user, removeReaction) {
    //[TODO]// need to make it so it checks if the user has sufficient privileges to add/remove a reaction
    /*
    const message = !reaction.message.author ?
        await reaction.message.fetch() :
        reaction.message;
    
    //let guild = message.gi

    // if its a reaction to anything else than the bot, ignore it.
    if (message.author.id !== client.user.id) return;

    // if its the bot reacting to its self, ignore it.
    if (message.author.id === user.id) return;

    // regex that grabs the command identifier in the embeds footer.
    const regex = /\[(.+)\]/gm;

    if (message.embeds !== undefined) message.embeds.forEach(embed => {
        let commandRefrence = regex.exec(embed.footer.text)[1].split(',');

        if (Object.keys(global.commands).includes(commandRefrence[0])) {
            //console.log(reaction.users.reaction.users.reaction.message)
                //user.member.roles.cache.map(m => console.log(m.name))
                //let hasPremissions = checkPermisions(reaction.message.author, global.commands[commandRefrence[0]]);
                //console.log(hasPremissions, getUserRoles(reaction.message.author))
        }
    })*/
}

// {
//  commandName: the name of the command, also used to actual call the command,
//  callbackFunction: must take one parameter, will be exectued when the user calls the command,
//  description: a short description on what the command dose.
//  roles: [] an array of all the roles that can use this command
//  reactionAddCallback: function called upon once a reaction is added to the message
// }
exports.addCommand = function addCommand(params = { commandName, description, callbackFunction, roles: [] }) {
    //Throw errors if not all required parameters are satisfied
    if (commands[params.commandName]) throw new Error('A command with that name already exists');
    if (params.commandName === undefined) throw new Error('No commandName provided');
    if (params.callbackFunction === undefined) throw new Error('No callbackFunction provided');

    global.commands[params.commandName.toLowerCase()] = params;
}