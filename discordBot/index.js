let tokens = require('./token');
global.mongodb = tokens.mongodb;
global.discord = tokens.discord;
global.botid = tokens.botid;

let bot = require('./botSrc');

global.prefix = '.';

//--// help command //--//
bot.addCommand({
    commandName: 'help',
    callbackFunction: function(parameters, message, roles) {
        let helpEmbed = {
            color: 0x0099ff,
            title: 'Here are all the available commands!',
            url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
            description: 'To get more info about a command, just type **help** than the command inquestion after it!',
            thumbnail: {
                url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
            },
            fields: [{
                name: '\u200b',
                value: '\u200b',
                inline: false,
            }],
            timestamp: new Date(),
            footer: {
                text: 'Made by Grzegorz M',
                icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
            },
        };

        let count = 0;
        //loop tru every command available.
        Object.keys(global.commands).forEach(command => {
            let pass = false,
                commandObj = global.commands[command];

            roles.forEach(role => {
                if (commandObj.roles !== undefined) {
                    //checks if the user has sufficient privileges to view the command.
                    if (commandObj.roles.includes(role)) pass = true;
                } else pass = true
            });

            if (pass === true) {
                helpEmbed.fields = [...helpEmbed.fields, {
                    name: `${global.prefix}${commandObj.commandName}`, //Give the help entry a name
                    value: commandObj.description, //Give the help entry a description
                    inline: function() {
                        if (++count % 3 === 0) return false; //every seccond item move onto a new line.
                        else return true;
                    }(),
                }];
            }
        });
        message.channel.send({ embeds: [helpEmbed] });
    },
    description: 'A command that displays all available commands.',
    roles: [
        'user'
    ]
});

//--// Manualy authenticate a user //--//
bot.addCommand({
    commandName: 'adduser',
    callbackFunction: function(parameters, message, roles) {
        message.channel.send('poo');
    },
    description: 'This command authenticates a user manualy.',
    roles: [
        'test'
    ]
});

//--// removes a users authentication //--//
bot.addCommand({
    commandName: 'remuser',
    callbackFunction: function(parameters, message, roles) {
        message.channel.send('poo');
    },
    description: 'This command removes a users authentication.',
    roles: [
        'test'
    ]
});

//--// get timetable //--//
bot.addCommand({
    commandName: 'timetable',
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
        message.channel.send('timetable');
    },
    description: 'This command provides you with your timetable.',
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