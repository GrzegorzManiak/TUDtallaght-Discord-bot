exports.command = {
    commandName: 'Next',
    callbackFunction: function(parameters, message, roles) {
        // Im tring to avoid long path chains with process.cwd()
        let timetableHelper = require(process.cwd() + '/helpers/timetable.js'),
            userDataHelper = require(process.cwd() + '/helpers/userData.js'),
            userDetails = userDataHelper.getUserData(message.author.id),
            timetable = timetableHelper[userDetails.classgroup],
            embedArray = [];

        // delete the msg that called the command if its in a server, not a dm.
        if (message.channel.type === 'GUILD_TEXT') message.delete();

        console.log(now.getDay())

        /*
        Object.keys(timetable).forEach(day => {

            let dayCompiled = '';
            Object.keys(timetable[day]).forEach(classDetials => {
                classDetials = timetable[day][classDetials];
                dayCompiled += `> **[${classDetials.startTime} - ${classDetials.endTime}]**  ${classDetials.className}, ${function(){
            let constructor = '';
            if(classDetials?.lab === true) constructor += ' Lab ';
            return constructor += classDetials.class;
        }()} \n`;
            })

            embedArray = [...embedArray, {
                name: `\n${day.charAt(0).toUpperCase() + day.slice(1)}`,
                value: dayCompiled,
                inline: false,
            }]
        });

        message.author.send({
            embeds: [{
                color: 0x0099ff,
                title: `Here are all your classes for the week, ${userDetails.name[0].charAt(0).toUpperCase() + userDetails.name[0].slice(1)}`,
                url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
                thumbnail: {
                    url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
                },
                description: '',
                fields: [embedArray],
                footer: {
                    text: `Made by Grzegorz M | [timetable,${userDetails.classgroup}]`,
                    icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
                },
            }]
        })*/
    },
    canExecInDm: true,
    description: 'This command provides you with your next class.',
    roles: [
        'user',
        'test'
    ],
}