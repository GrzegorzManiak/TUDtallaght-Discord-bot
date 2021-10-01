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
    message.channel.send({ embeds: [timetableFail], components: [retryButton(message.guildId, message.id)], fetchReply: true }).then(msg => {
        global.createTimedDelete(msg, 1);
        global.createTimedDelete(message, 1);
    });
}

exports.command = {
    commandName: 'timeTable',
    callbackFunction: function(parameters, message, roles) {
        //let timetable = require('../timetableHandler/index.js');
        //console.log(timetable.fetchTimetable('TA_KAITM_B_1b'))

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