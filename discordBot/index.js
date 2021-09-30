//Initiate all tokens/private keys
require('./token').initGlobals();

const bot = require('./src');
let commandDirectory = './src/commands/';

//--// help command //--//
bot.addCommand(require(commandDirectory + 'help.js').command);

//--// spawns aan message to allow users to verify their emails //--//
bot.addCommand(require(commandDirectory + 'spawnauthmsg.js').command);

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

//--// get timetable //--//
bot.addCommand({
    commandName: 'timeTable',
    callbackFunction: function(parameters, message, roles) {
        message.channel.send('timetable');
    },
    description: 'This command provides you with your timetable.',
    roles: [
        'user',
        'test'
    ]
});

//--// gets the next class and the room  //--//
bot.addCommand({
    commandName: 'next',
    callbackFunction: function(parameters, message, roles) {
        message.channel.send('timeTable');
    },
    description: 'This tells you your next class and class number.',
    roles: [
        'user',
        'test'
    ]
});

// Loads the users discordId into cache for a set ammount of time
// it also creates a link for the user to be able to click which 
// prompts them to log in with their school email.
//
// discordId - String - the users actual uniqe discord ID
function createConfirmationRequest(discordId) {

}