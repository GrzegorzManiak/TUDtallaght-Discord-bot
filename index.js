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

global.userRoles = ['{🎓} student'];
global.adminRoles = ['admins'];
global.classRoles = ['{🟠} group 1a1', '{🔴} group 1a2', '{🟣} group 1b1', '{🔵} group 1b2'];

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

//--// gets the users next class //--//
bot.addCommand(require(commandDirectory + 'next.js').command);

bot.setConfig({
    serverid: '892820301224751175',
    devid: ['460756817006428162'],
    token: global.discord,
    allowslashcommands: true,
    allowdmcommands: true,
    allowdminteractions: true,
    logCommands: true,
    remindme: true
});

bot.startBot().then(async(client) => {
    if (bot.getConfig().remindme !== true) return;

    let channelSetting = global.settings.get(entries => entries.remindMe);
    if (channelSetting?.remindMe === null | undefined) return console.log('No remindMe channel set, set it with setremindmechannel channelID');
    if (bot.getConfig().logCommands === true) console.log('started remind me loop');

    const timetableHelper = require('./helpers/timetable');
    async function recursive() {
        //Gets the current date and time.
        let loopStart = new Date();
        loopStart.setDate(loopStart.getDate());

        //Gets tommorow, 5hr 0min 0s 0ms
        let loopEnd = new Date();
        loopEnd.setDate(loopEnd.getDate() + 1);
        loopEnd.setHours(5);
        loopEnd.setMinutes(0);
        loopEnd.setSeconds(0);
        loopEnd.setMilliseconds(0);

        let loopAgain = (loopEnd.getTime() - loopStart.getTime()), // find out how long till the next day
            date = new Date(),
            currentTime = new Date(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes()),
            remindMeTimes = [5, 10, 15, 20, 25, 30];

        let timetables = {
            [global.classRoles[0]]: timetableHelper.a1,
            [global.classRoles[1]]: timetableHelper.a2,
            [global.classRoles[2]]: timetableHelper.b1,
            [global.classRoles[3]]: timetableHelper.b2
        }

        Object.keys(timetables).forEach((timetable) => {
            if (bot.getConfig().logCommands === true) console.log('refreshed remindme');

            let selectedDay = timetableHelper.getDay(timetables[timetable], date.getDay());

            selectedDay[0].forEach((key) => {
                let subjectsTime = key.startTime.split(':'),
                    parsedTime = new Date(date.getFullYear(), date.getMonth(), date.getDay(), subjectsTime[0], subjectsTime[1]);

                if (parsedTime.getTime() > currentTime.getTime()) {
                    let timeTillNextClass = ((parsedTime.getTime() - currentTime.getTime()) / 1000) / 60;

                    remindMeTimes.forEach(remindMe => {
                        let sleepFor = timeTillNextClass - remindMe;

                        if (sleepFor > 0) {
                            setTimeout(function() {
                                let users = [];
                                global.users.get(user => {
                                    //sconsole.log(user.alertme.toString(),remindMe.toString(),user.group,timetable)
                                    if (user.group === timetable && user.alertme.toString() === remindMe.toString() && user.alertme !== 'false') users = [...users, user.userid];
                                });

                                let channel = client.channels.cache.get(channelSetting.remindMe);
                                if (channel === undefined) return console.log('!!!ERR REMINDME CHANNEL DOSE NOT EXIST!!!');

                                if (users?.length > 0) {
                                    let tagAlong = '';

                                    users.forEach(user => {
                                        tagAlong += `>>> <@${user}> `;
                                    })

                                    let embed = {
                                        color: 0x0099ff,
                                        title: `Reminder for **${key.className}**`,
                                        url: global.github,
                                        thumbnail: {
                                            url: global.logo,
                                        },
                                        description: `**${key.className}** starts at **${key.startTime}** which is in **${timeTillNextClass}** Min, ${key.class}`,

                                        content: tagAlong,
                                        footer: {
                                            text: `Made by Grzegorz M | [SpawnRemind]`,
                                            icon_url: global.logo,
                                        },
                                    };
                                    if(bot.getConfig().logCommands === true) console.log(`sent out ${key.className} ${key.startTime} ${timeTillNextClass}`);
                                    channel.send({ 
                                        embeds: [embed], 
                                        fetchReply: true
                                    }).then(() => {
                                        channel.send(tagAlong);
                                    });
                                }
                            }, sleepFor * 60000);
                        }
                    });
                }
            });
        });
        await sleep(loopAgain);
        recursive();
    }
    recursive();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}