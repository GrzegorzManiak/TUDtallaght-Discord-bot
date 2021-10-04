let sendCloseBtn = function(guild, id) {
    return new global.discordjs.MessageActionRow()
        .addComponents(
            new global.discordjs.MessageButton()
            .setCustomId(`button,timetable,close,${guild},${id}`)
            .setLabel("Close")
            .setStyle('DANGER')
        );
}

exports.command = {
    commandName: 'TimeTable',
    callbackFunction: function(parameters, message, roles, slashCommand) {
        // Im tring to avoid long path chains with process.cwd()
        let timetableHelper = require(process.cwd() + '/helpers/timetable.js'),
            userDataHelper = require(process.cwd() + '/helpers/userData.js'),
            userDetails = userDataHelper.getUserData(message?.author?.id || message?.user?.id),
            timetable = timetableHelper[userDetails.classgroup],
            embedArray = [];

        // delete the msg that called the command if its in a server, not a dm.
        if (message.channel.type === 'GUILD_TEXT' && slashCommand === false) message.delete();

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

        let msgContent = {
            embeds: [{
                color: 0x0099ff,
                title: `Here are all your classes for the week, ${userDetails.name[0].charAt(0).toUpperCase() + userDetails.name[0].slice(1)}.`,
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
            }],
            components: [sendCloseBtn(message.guildId, message.id)]
        };

        switch(slashCommand){
            case true:
                msgContent.ephemeral = true;
                msgContent.components = [];
                message.reply(msgContent)
                return;

            case false:
                message.author.send(msgContent);
                return;
        }
    },
    buttonClickCallback: function(message, interaction, parameters, roles) {
        if (parameters[2] === 'close') {
            message.delete();
        }
    },
    canExecInDm: true,
    useSlashCommands: true,
    description: 'This command provides you with your timetable.',
    roles: {
        user: global.userRoles,
        buttonRoles: global.userRoles
    },
}