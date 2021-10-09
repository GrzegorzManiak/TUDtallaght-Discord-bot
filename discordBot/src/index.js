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
exports.startBot = async() => {
    // Authenticate the bot
    client.login(config.token);

    // Return a promise so that other functions can execute after authentication
    return new Promise(function(resolve, reject) {
        // confirm that the bot authenticated
        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}, ${client.user.id}!`);
            if(config.useSlashCommands === true) addSlashCommands();
            resolve(client);
        });
    });
}

// triggers everytime a message is sent.
client.on('messageCreate', async(message) => {
    require('./handlers/commandHandler').commandHandler(message);
});

/*
//triggers everytime a reaction is added to a msg sent from the bot
client.on('messageReactionAdd', async(reaction, user) => {
    require('./handlers/reactionHandler').reactionHandler(reaction, user, false);
});
*/
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

exports.addCommand = async function addCommand(params) {
    //Throw errors if not all required parameters are satisfied
    let commandTemp = {
        details: {
            commandName: '',
            commandShortDescription: '',
            commandLongDescription: '',
        },

        roles: {
            user: [], // Roles that can call the actual command
            menu: [], // Roles that can interact with the menu attached to the command
            button: [], // Roles that can click the buttons attached to the command
            reaction: [], // Roles that can interact with reactions attached to the command
        },

        parameters: [], // Paramters = [{ type:'', name:'', description: '', required: false }]
        executesInDm: false, // Can the command execute in the users DM, Will use role data from the server defined in the config.serverid, leave false otherwise
        interactionsInDm: false, // If a msg is sent to the user with attached interactables, can the user use them?
        isSlashCommand: true, // Can this command be executed with discord slash commands?
        helpEmbedPage: 0, 

        commandCallback: function(parameters, interaction, obj = {roles, isSlashCommand}){},
        menuCallback: function(parameters, interaction, obj = {values, roles}){},
        buttonCallback: function(parameters, interaction, obj = {roles}){}
    }

    Object.assign(commandTemp, params);
    config.commands[params?.details?.commandName.toLowerCase()] = params;
}

function addSlashCommands() {
    let guild = client.guilds.cache.get(config.serverid);
    let commands = guild.commands;

    Object.keys(config.commands).forEach(command => {
        if(config.commands[command]?.isSlashCommand !== true) return;

        let data = new slashCommandBuilder()
	        .setName(command)
	        .setDescription(config.commands[command].details.commandShortDescription);

        if(config.commands[command]?.parameters?.length > 0){
            config.commands[command].parameters.forEach(param => {
                function setParams(option){
                    return option.setName(param.name).setDescription(param.description).setRequired(param?.required || false);
                }

                switch(param.type){
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

exports.createCustomID = () => {

}

exports.decodeCustomID = () => {
    
}