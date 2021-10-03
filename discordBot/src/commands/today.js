function returnClasses(message, specificDay, edit = false, interaction) {
    // Im tring to avoid long path chains with process.cwd()
    let timetableHelper = require(process.cwd() + '/helpers/timetable.js'),
        userDataHelper = require(process.cwd() + '/helpers/userData.js'),
        userDetails = userDataHelper.getUserData(message.author.id),
        timetable = timetableHelper[userDetails.classgroup],
        day = '';

    // delete the msg that called the command if its in a server, not a dm.
    if (message.channel.type === 'GUILD_TEXT') message.delete();

    let classes = function() {
        if (specificDay === undefined) specificDay = new Date().getDay();
        switch (specificDay) {
            case 1: //monday
                day = 'monday';
                return timetable.monday;

            case 2: //tuesday
                day = 'tuesday';
                return timetable.tuesday;

            case 3: //wednesday
                day = 'wednesday';
                return timetable.wednesday;

            case 4: //thursday
                day = 'thursday';
                return timetable.thursday;

            case 5: //friday
                day = 'friday';
                return timetable.friday;

            case 6: //saturday
                day = 'saturday';
                return undefined;

            case 7: //saturday
                day = 'sunday';
                return undefined;
        };
    };

    let title,
        embedArray = [],
        dayCompiled = '';

    if (classes() === undefined) {
        title = `You do not have any classes on this day, ${userDetails.name[0].charAt(0).toUpperCase() + userDetails.name[0].slice(1)}.`
        embedArray = [{
            name: `Just sit back and enjoy the day`,
            value: 'If you belive that this is a mistake, and you do indeed have classes today, please contact Gregor.',
            inline: false,
        }];
    } else {
        classes().forEach(classDetials => {
            dayCompiled += `> **[${classDetials.startTime} - ${classDetials.endTime}]**  ${classDetials.className}, ${function(){
            let constructor = '';
            if(classDetials?.lab === true) constructor += ' Lab ';
                return constructor += classDetials.class;
        }()} \n`;
        });

        embedArray = [...embedArray, {
            name: `\n${day.charAt(0).toUpperCase() + day.slice(1)}`,
            value: dayCompiled,
            inline: false,
        }];

        title = `Your classes for ${day}, ${userDetails.name[0].charAt(0).toUpperCase() + userDetails.name[0].slice(1)}.`
    }

    let yesterday = function() {
        let temp = specificDay - 1;
        if (temp < 1) return 7;
        else return temp;
    };

    let tommorow = function() {
        let temp = specificDay + 1;
        if (temp > 7) return 1;
        else return temp;
    }

    let sendButtons = function() {
        return new global.discordjs.MessageActionRow()
            .addComponents(
                new global.discordjs.MessageButton()
                .setCustomId(`button,today,close`)
                .setLabel("Close")
                .setStyle('DANGER')
            )
            .addComponents(
                new global.discordjs.MessageButton()
                .setCustomId(`button,today,daybefore,${yesterday()}`)
                .setLabel("Day before")
                .setStyle('PRIMARY')
            )
            .addComponents(
                new global.discordjs.MessageButton()
                .setCustomId(`button,today,dayafter,${tommorow()}`)
                .setLabel("Day after")
                .setStyle('PRIMARY')
            );
    }

    let mainEmbed = [{
        color: 0x0099ff,
        title,
        url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
        thumbnail: {
            url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
        },
        description: '',
        fields: [embedArray],
        footer: {
            text: `Made by Grzegorz M | [today,${userDetails.classgroup}]`,
            icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
        },
    }];

    if (edit === false) {
        message.author.send({
            embeds: mainEmbed,
            fetchReply: true,
            components: [sendButtons()],
        });
    } else {
        interaction.reply({
            embeds: mainEmbed,
            fetchReply: true,
            components: [sendButtons()],
        });
    }
}

exports.command = {
    commandName: 'Today',
    callbackFunction: function(parameters, message, roles) {
        returnClasses(message);
    },
    buttonClickCallback: function(message, interaction, parameters, roles) {
        switch (parameters[2]) {
            case 'close':
                message.delete();
                return;

            case 'daybefore':
                message.delete();
                returnClasses(message, parseInt(parameters[3]), true, interaction);
                return;

            case 'dayafter':
                message.delete();
                returnClasses(message, parseInt(parameters[3]), true, interaction);
                return;
        }
    },
    canExecInDm: true,
    description: 'This command provides you with your next classes for the day.',
    roles: [
        'user',
        'test'
    ],
    buttonRoles: [
        'user'
    ]
}