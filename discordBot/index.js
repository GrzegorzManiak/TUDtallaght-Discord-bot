//Initiate all tokens/private keys
require('./token').initGlobals();

const bot = require('./src');
let commandDirectory = './src/commands/';

global.userRoles = [ 'user' ];
global.adminRoles = [ 'test' ];

//--// help command //--//
bot.addCommand(require(commandDirectory + 'help.js').command);

//--// spawns a message to allow users to verify their emails //--//
bot.addCommand(require(commandDirectory + 'spawnauthmsg.js').command);

//--// get users timetable //--//
bot.addCommand(require(commandDirectory + 'timetable.js').command);

//--// gets the classes for that day //--//
bot.addCommand(require(commandDirectory + 'today.js').command);

//--// gets the next class and the room  //--//
bot.addCommand(require(commandDirectory + 'next.js').command);

bot.setConfig({
    token: global.discord,
    serverid: global.serverid
});
bot.startBot();