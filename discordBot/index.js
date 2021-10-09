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
    serverid: '892820301224751175',
    devid: ['460756817006428162'], 
    token: global.discord,
    useSlashCommands: true,
});

bot.startBot().then(async(client) => {
    let classes = require('./src/classes');
    let user = new classes.user('460756817006428162', '892820301224751175', client);

    let roles = await user.getRolesName();
    let pass = await user.hasRoles(roles);

    console.log(pass)

    user.sendMessage({ content:'poo', fetchReply: true}).then((msg) => {
        let message = new classes.message(msg, client);

        message.delete().then((rtn) => console.log(rtn));
        message.delete().then((rtn) => console.log(rtn.httpStatus));

        message.getUser().then((usr) => console.log(usr))
    });
});

