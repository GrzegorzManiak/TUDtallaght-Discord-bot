const discordJS = require('discord.js');
const client = new discordJS.Client({
    intents: [
        discordJS.Intents.FLAGS.GUILDS, //Give the bot access to its connected guilds, should only be one tho.
        discordJS.Intents.FLAGS.GUILD_MESSAGES, //Give it the ability to see incoming messages.
        discordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS //Gives the bot the ability to check for and add reactions
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//these are temporary, I add them when I need them.
global.prefix = '.';
global.commands = {};
global.client = client;
global.discordjs = discordJS;

// Authenticate the bot
client.login(global.discord);

// confirm that the bot authenticated
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}, ${client.user.id}!`);
});

function getUserRolesFromMessage(message, roles = []) {
    message.member.roles.cache.map(m => roles = [...roles, m.name]);
    return roles;
}

// checks if the user has sufficient privileges to preform an action.
function checkPermisions(requiredRoles, usersRoles, pass = false) {
    if (requiredRoles.length < 1) return true;

    usersRoles.forEach(role => {
        if (requiredRoles.includes(role)) pass = true
    });

    return pass;
}

// triggers everytime a message is sent.
client.on('messageCreate', async(message) => {
    commandHandler(message);
});

function commandHandler(message) {
    let charArray = message.content.split('');

    // If the message dosent begin with the command prefix, return.
    if (charArray[0] !== global.prefix) return;

    // Splits the message content up into words eg => a b c = ['a','b','c']
    let splitMessage = message.content.split(' ');

    // gives us the acutal command name by getting the first word and dropping the prefix character
    let command = global.commands[splitMessage[0].substring(1).toLowerCase()];

    // check if the command acutaly exists
    if (command === undefined) return;

    let userRoles = getUserRolesFromMessage(message),
        hasPremissions = checkPermisions(userRoles, command.roles);

    if (hasPremissions === false) message.channel.send(`${message.member} You dont have the sufficient privileges to execute this command.`);
    else command.callbackFunction(splitMessage, message, userRoles)
}

//triggers everytime a reaction is added to a msg sent from the bot
client.on('messageReactionAdd', async(reaction, user) => {
    reactionHandler(reaction, user, false);
});

async function reactionHandler(reaction, user, removeReaction, roles = []) {
    // Load the msg in if its not cached
    const message = !reaction.message.author ?
        await reaction.message.fetch() :
        reaction.message;

    // if its a reaction to anything else than the bot, ignore it.
    if (message.author.id !== client.user.id) return;

    // if its the bot reacting to its self, ignore it.
    if (message.author.id === user.id) return;

    // grab the current guild
    let guild = client.guilds.cache.get(message.guildId);

    // grab the current user
    let member = guild.members.cache.get(user.id);

    // get all the users roles and add them the the 'roles' array
    member.roles.cache.map(m => roles = [...roles, m.name.toLowerCase()]);

    if (message.embeds !== undefined) message.embeds.forEach(embed => {
        // grab the command refrence at the footer of every embed
        let commandRefrence = /\[(.+)\]/gm.exec(embed.footer.text)[1].split(','),
            command = global.commands[commandRefrence[0].toLowerCase()],
            reactionEmojie = reaction._emoji.name;

        // Check if the user containts the right premisions to react
        if (checkPermisions(roles, [...command.reactionRoles, command.roles]) !== true) return;
        switch (removeReaction) {
            case false: // User added a reaction
                return command.reactionAddCallback(reactionEmojie, message, reaction, roles)
        }
    })
}

// triggers everytime a interaction is created.
client.on('interactionCreate', async(interaction) => {
    // only act if the object being interacted with originated from the bot it self.
    // makes it so this dosent respond to other bots etc
    if (interaction.message.author.id !== client.user.id) return;

    let id = interaction.customId;
    if (id === undefined) return;

    let parameters = id.split(',');

    switch (parameters[0]) {
        case 'button':
            return buttonHandler(interaction, parameters);
    }
});

async function buttonHandler(interaction, parameters, roles = []) {
    // Load the msg in if its not cached
    const message = !interaction.message.author ?
        await interaction.message.fetch() :
        interaction.message;

    // grab the current user
    let member = interaction.guild.members.cache.get(interaction.user.id),
        command = global.commands[parameters[1].toLowerCase()];

    // check if the command exists
    if (command === undefined) return;

    // get all the users roles and add them the the 'roles' array
    member.roles.cache.map(m => roles = [...roles, m.name.toLowerCase()]);

    // Check if the user containts the right premisions to react
    if (checkPermisions(roles, [...command.buttonRoles, command.roles]) !== true) return;
    return command.buttonClickCallback(message, interaction, parameters, roles);
}

//TODO// I need to make this cleaner as and refactor it, right now im slapping things onto this as I need them.
// {
//  commandName: the name of the command, also used to actual call the command,
//  callbackFunction(parameters, message, userroles): must take one parameter, will be exectued when the user calls the command,
//  description: a short description on what the command dose.
//  roles: [] an array of all the roles that can use this command
//  reactionRoles: [] an array of all the roles that can react to this command
//  reactionAddCallback(reactionEmojie, message, reaction, userroles): function called upon once a reaction is added to the message
//  reactionRemCallback(reactionEmojie, message, reaction, userroles): function called upon once a reaction is removed from the message
//  buttonClickCallback(message, interaction, parameters, roles)
// }
exports.addCommand = function addCommand(params = { commandName, description, callbackFunction, roles: [] }) {
    //Throw errors if not all required parameters are satisfied
    if (commands[params.commandName]) throw new Error('A command with that name already exists');
    if (params.commandName === undefined) throw new Error('No commandName provided');
    if (params.callbackFunction === undefined) throw new Error('No callbackFunction provided');

    if (params.roles === undefined) params.roles = [];
    if (params.reactionRoles === undefined) params.reactionRoles = [];
    if (params.buttonRoles === undefined) params.buttonRoles = [];

    global.commands[params.commandName.toLowerCase()] = params;
}

// delte in X ammount of minutes. helps with congestion in chat by deleteing old msgs.
global.createTimedDelete = async function createTimedDelete(message, time) {
    setTimeout(() => {
        message.delete().catch(() => {});
    }, time * 60);
}