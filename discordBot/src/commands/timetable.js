function sendTimetable(message) {
    // Im tring to avoid long path chains with process.cwd()
    let timetableHelper = require(process.cwd() + '/helpers/timetable.js'),
        userDataHelper = require(process.cwd() + '/helpers/userData.js');

    let userDetails = userDataHelper.getUserData(message.author.id);
    let timetable = timetableHelper[userDetails.classgroup];

    message.delete();
    let embedArray = [];

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
            name: day.charAt(0).toUpperCase() + day.slice(1),
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
    })

}

exports.command = {
    commandName: 'timeTable',
    callbackFunction: function(parameters, message, roles) {
        sendTimetable(message);
    },
    description: 'This command provides you with your timetable.',
    roles: [
        'user',
        'test'
    ],
}