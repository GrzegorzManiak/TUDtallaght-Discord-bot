//Initiate all tokens/private keys
require('./token').initGlobals();
require('./fun');

const bot = require('./source');
let db = require('simpl.db');
let commandDirectory = './commands/';

global.db = new db.Database();
global.users = global.db.createCollection('users');
global.settings = global.db.createCollection('settings');

global.logo = 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80';
global.github = 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot';

global.userRoles = ['[members]'];
global.adminRoles = ['admin'];
global.classRoles = ['[1a1]', '[1a2]', '[1b1]', '[1b2]'];

//--// help command //--//
bot.addCommand(require(commandDirectory + 'help.js').command);

//--// spawns a message to allow users to verify their emails //--//
bot.addCommand(require(commandDirectory + 'spawnauthmsg.js').command);

//--// spawns a msg where the user can select their class group //--//
bot.addCommand(require(commandDirectory + 'spawnclassgroupmsg.js').command);

//--// spawns a msg where the user can select if they want to be reminded //--//
bot.addCommand(require(commandDirectory + 'spawnremind.js').command);

//--// This command sets the remindMe channel.//--//
bot.addCommand(require(commandDirectory + 'setremindmechannel.js').command);

//--// get users timetable //--//
bot.addCommand(require(commandDirectory + 'timetable.js').command);

//--// gets the classes for that day //--//
bot.addCommand(require(commandDirectory + 'today.js').command);

//--// converts bases //--//
bot.addCommand(require(commandDirectory + 'convertbase.js').command);

//--// gets the users next class //--//
// bot.addCommand(require(commandDirectory + 'next.js').command);

bot.setConfig({
    serverid: '905943487533432872',
    devid: ['460756817006428162'],
    token: global.discord,
    allowslashcommands: true,
    allowdmcommands: true,
    allowdminteractions: true,
    logCommands: true,
    remindme: false
});

bot.startBot()