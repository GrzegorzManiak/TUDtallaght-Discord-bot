//Initiate all tokens/private keys
require('./token').initGlobals();

const bot = require('./src');
let commandDirectory = './src/commands/';

//--// help command //--//
bot.addCommand(require(commandDirectory + 'help.js').command);

//--// spawns a message to allow users to verify their emails //--//
bot.addCommand(require(commandDirectory + 'spawnauthmsg.js').command);

//--// get users timetable //--//
bot.addCommand(require(commandDirectory + 'timetable.js').command);

//--// gets the next class and the room  //--//
bot.addCommand(require(commandDirectory + 'next.js').command);

//--// gets the classes for that day //--//
bot.addCommand(require(commandDirectory + 'today.js').command);

//--// Manualy authenticate a user //--//
bot.addCommand({
    commandName: 'addUser',
    callbackFunction: function(parameters, message, roles) {
        message.channel.send('poo');
    },
    description: 'This command authenticates a user manualy.',
    helpEmbedPage: -1,
    roles: [
        'test'
    ]
});

//--// removes a users authentication //--//
bot.addCommand({
    commandName: 'remUser',
    callbackFunction: function(parameters, message, roles) {
        message.channel.send('poo');
    },
    description: 'This command removes a users authentication.',
    helpEmbedPage: -1,
    roles: [
        'test'
    ]
});