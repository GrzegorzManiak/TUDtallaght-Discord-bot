const timetableFail = {
    color: 0x0099ff,
    title: 'There was an error fetching your timetable!',
    url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
    description: 'You can contact <@460756817006428162> for assistance or you can click retry.',
    fields: [],
    footer: {
        text: 'Made by Grzegorz M | [timetable]',
        icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
    },
};

let retryButton = function(guildid, id) {
    return new global.discordjs.MessageActionRow()
        .addComponents(
            new global.discordjs.MessageButton()
            .setCustomId(`button,timeTable,close,${guildid},${id}`)
            .setLabel("Close")
            .setStyle('DANGER')
        )
        .addComponents(
            new global.discordjs.MessageButton()
            .setCustomId(`button,timeTable,retry,${guildid},${id}`)
            .setLabel("Retry")
            .setStyle('SUCCESS')
        );
};

function sendTimetable(message) {
    // Im tring to avoid long path chains with process.cwd()
    let timetableHelper = require(process.cwd() + '/helpers/timetable.js');
    let userDataHelper = require(process.cwd() + '/helpers/userData.js');

    let timetable = timetableHelper.fetchTimetable(userDataHelper.getUserData().timetable);

    if (timetable.error !== undefined) {
        message.channel.send({ embeds: [timetableFail], components: [retryButton(message.guildId, message.id)], fetchReply: true }).then(msg => {
            global.createTimedDelete(msg, 2);
            global.createTimedDelete(message, 2);
        });
    } else {
        message.delete();
        let embedArray = [];

        Object.keys(timetable).forEach(day => {
            let fullDay = () => {
                switch (day) {
                    case 'mon':
                        return 'Monday';
                    case 'tue':
                        return 'Tuesday';
                    case 'wed':
                        return 'Wednesday';
                    case 'thu':
                        return 'Thursday';
                    case 'fri':
                        return 'Friday';
                }
            }
            let dayCompiled = '';
            Object.keys(timetable[day]).forEach(classDetials => {
                classDetials = timetable[day][classDetials];
                dayCompiled += `> **[${classDetials.start} - ${classDetials.finish}]** ${classDetials.subject_name.replace(/[{}]+/gm, '')} **in room** ${classDetials.room.replace(/[{}TallaghtMain\-\s]+/gm, '')} \n`;
            })

            embedArray = [...embedArray, {
                name: fullDay(),
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
}

exports.command = {
    commandName: 'timeTable',
    callbackFunction: function(parameters, message, roles) {
        sendTimetable(message);
    },
    buttonClickCallback: function(message, interaction, parameters, roles) {
        if (parameters[2] === 'close') message.delete();
        else if (parameters[2] === 'retry') {
            message.delete();
            sendTimetable(message);
        }
    },
    description: 'This command provides you with your timetable.',
    roles: [
        'user',
        'test'
    ],
    buttonRoles: [
        'user'
    ]
}