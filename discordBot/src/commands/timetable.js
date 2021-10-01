function sendTimetable(message) {
    // Im tring to avoid long path chains with process.cwd()
    let timetableHelper = require(process.cwd() + '/helpers/timetable.js');
    let userDataHelper = require(process.cwd() + '/helpers/userData.js');

    let timetable = timetableHelper.b1;

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
            name: day,
            value: dayCompiled,
            inline: false,
        }]
    });

    message.author.send({
        embeds: [{
            color: 0x0099ff,
            title: `Your classes for Week`,
            description: '',
            url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
            fields: [embedArray],
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