//Initiate all tokens/private keys
require('./token').initGlobals();

const bot = require('./src');
let commandDirectory = './src/commands/';

global.logo = 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80';
global.github = 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot';

global.userRoles = [ '{🎓} student' ];
global.adminRoles = [ 'admins' ];
global.classRoles = [ '{🟠} group 1a1', '{🔴} group 1a2', '{🟣} group 1b1', '{🔵} group 1b2' ];

//--// help command //--//
bot.addCommand(require(commandDirectory + 'help.js').command);

//--// spawns a message to allow users to verify their emails //--//
bot.addCommand(require(commandDirectory + 'spawnauthmsg.js').command);

//--// spawns a msg where the user can select their class group //--//
bot.addCommand(require(commandDirectory + 'spawnclassgroupmsg.js').command);

//--// get users timetable //--//
bot.addCommand(require(commandDirectory + 'timetable.js').command);

//--// gets the classes for that day //--//
bot.addCommand(require(commandDirectory + 'today.js').command);

bot.setConfig({
    serverid: '892714214383308800',
    devid: ['460756817006428162'], 
    token: global.discord,
    serverid: global.serverid,
    useSlashCommands: true,
});
bot.startBot();