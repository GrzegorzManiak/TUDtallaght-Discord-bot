const discordJS = require('discord.js');
const slashCommandBuilder = require('@discordjs/builders').SlashCommandBuilder;
const client = new discordJS.Client({
    intents: [
        discordJS.Intents.FLAGS.GUILDS, //Give the bot access to its connected guilds, should only be one tho.
        discordJS.Intents.FLAGS.GUILD_MESSAGES, //Give it the ability to see incoming messages.
        discordJS.Intents.FLAGS.DIRECT_MESSAGES, //Give it the ability to see incoming messages.
        discordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS //Gives the bot the ability to check for and add reactions
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

exports.client = client;
exports.discordjs = discordJS;
exports.slashCmdBuilder = slashCommandBuilder;

let config = {
    roles: {
        user: [],
        admin: []
    },
    commands: {},
    allowslashcommands: true,
    prefix: '.',
    token: '',
    serverid: '',
}

// sets the current configuration
exports.setConfig = (obj)=>{
    Object.assign(config, obj);
}

// returns the current configuration
exports.getConfig = ()=>{
    return config;
}

// this function starts the bot
exports.startBot = () => {
    // Authenticate the bot
    client.login(config.token);

    // confirm that the bot authenticated
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}, ${client.user.id}!`);
        if(config.useSlashCommands === true) addSlashCommands();
    });
}

// triggers everytime a message is sent.
client.on('messageCreate', async(message) => {
    require('./handlers/commandHandler').commandHandler(message);
});

//triggers everytime a reaction is added to a msg sent from the bot
client.on('messageReactionAdd', async(reaction, user) => {
    require('./handlers/reactionHandler').reactionHandler(reaction, user, false);
});

// triggers everytime a interaction is created.
client.on('interactionCreate', async(interaction) => {
    if (interaction?.componentType === 'BUTTON') 
        require('./handlers/buttonInteractionHandler').buttonInteractionHandler(interaction);

    else if (interaction?.commandName) 
        require('./handlers/slashInteractionHandler.js').slashInteractionHandler(interaction);

    else if (interaction?.componentType === 'SELECT_MENU')
        require('./handlers/menuInteractionHandler.js').menuInteractionHandler(interaction);
});

// checks if the user has sufficient privileges to preform an action.
exports.hasPermissions = (requiredRoles, usersRoles, pass = false) => {
    if (requiredRoles.length < 1) return true;

    usersRoles?.forEach(role => {
        if (requiredRoles.includes(role)) pass = true
    });

    return pass;
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
exports.addCommand = async function addCommand(params = { slashParams: [], commandName, description, callbackFunction, roles: [] }) {
    //Throw errors if not all required parameters are satisfied
    if (config.commands[params.commandName]) throw new Error('A command with that name already exists');
    if (params.commandName === undefined) throw new Error('No commandName provided');
    if (params.callbackFunction === undefined) throw new Error('No callbackFunction provided');

    if (params.roles === undefined) params.roles = [];
    if (params.reactionRoles === undefined) params.reactionRoles = [];
    if (params.buttonRoles === undefined) params.buttonRoles = [];
    if (params.canExecInDm === undefined) params.canExecInDm = false;

    config.commands[params.commandName.toLowerCase()] = params;

}

function addSlashCommands() {
    let guild = client.guilds.cache.get(config.serverid);
    let commands = guild.commands

    Object.keys(config.commands).forEach(command => {
        if(config.commands[command]?.useSlashCommands !== true) return;

        let data = new slashCommandBuilder()
	        .setName(command)
	        .setDescription(config.commands[command].description);

        if(config.commands[command]?.slashParams){
            config.commands[command].slashParams.forEach(param => {

                function setParams(option){
                    return option.setName(param[1]).setDescription(param[2]).setRequired(param[3] || false);
                }

                switch(param[0]){
                    case 'string':
                        data.addStringOption(option => setParams(option))
                        break;

                    case 'number':
                        data.addStringOption(option => setParams(option))
                        break;
                }
            });
        }

        commands.create(data);
    })
}

// delte in X ammount of minutes. helps with congestion in chat by deleteing old msgs.
exports.createTimedDelete = async(message, time) => {
    setTimeout(() => {
        message.delete().catch(() => {});
    }, time * 60000);
}