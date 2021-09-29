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

        Object.keys(global.commands).forEach(command => {
            let pass = false,
                commandObj = global.commands[command];

            roles.forEach(role => {
                if (commandObj.roles !== undefined) {
                    if (commandObj.roles.includes(role)) pass = true;
                } else pass = true
            });

            if (pass === true) {
                helpEmbed.fields = [...helpEmbed.fields, {
                    name: `${global.prefix}${commandObj.commandName}`,
                    value: commandObj.description,
                    inline: true,
                }];
            }
        });
        message.channel.send({ embeds: [helpEmbed] });
    },
    description: 'A command that displays all available commands',
});

// Loads the users discordId into cache for a set ammount of time
// it also creates a link for the user to be able to click which 
// prompts them to log in with their school email.
//
// discordId - String - the users actual uniqe discord ID
function createConfirmationRequest(discordId) {

}