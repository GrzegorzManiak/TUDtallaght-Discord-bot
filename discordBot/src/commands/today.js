function returnClasses(message, specificDay, edit = false, slashCommand) {
    // Im tring to avoid long path chains with process.cwd()
    let timetableHelper = require(process.cwd() + '/helpers/timetable.js'),
        userDataHelper = require(process.cwd() + '/helpers/userData.js'),
        userDetails = userDataHelper.getUserData(message?.author?.id || message?.user?.id),
        timetable = timetableHelper[userDetails.classgroup];

    // delete the msg that called the command if its in a server, not a dm.
    if (message.channel.type === 'GUILD_TEXT' && slashCommand === false) message.delete();

    if (specificDay === undefined) specificDay = new Date().getDay();
    let selectedDay = timetableHelper.getDay(timetable, specificDay),
        title,
        embedArray = [],
        dayCompiled = '';

    // Check if the day hsa any classes
    if (selectedDay[0] === undefined) {
        // set the title of the main embed
        title = `You do not have any classes on ${selectedDay[1]}, ${userDetails.name[0].charAt(0).toUpperCase() + userDetails.name[0].slice(1)}.`

        // add content to the embed array stateing that there's no classes for the selectedDay
        embedArray = [{
            name: `Just sit back and enjoy the day`,
            value: 'If you belive that this is a mistake, and you do indeed have classes today, please contact Gregor.',
            inline: false,
        }];
    } else {
        // set the title of the main embed
        title = `Your classes for ${selectedDay[1]}, ${userDetails.name[0].charAt(0).toUpperCase() + userDetails.name[0].slice(1)}.`

        // iterate tru each class in that day, format them and add them to an array
        selectedDay[0].forEach(classDetials => {
            dayCompiled += `> **[${classDetials.startTime} - ${classDetials.endTime}]**  ${classDetials.className}, ${function(){
            let constructor = '';
            if(classDetials?.lab === true) constructor += ' Lab ';
                return constructor += classDetials.class;
            }()} \n`;
        });

        // add the now formated classes into the embed array.
        embedArray = [...embedArray, {
            name: `\n${selectedDay[1].charAt(0).toUpperCase() + selectedDay[1].slice(1)}`,
            value: dayCompiled,
            inline: false,
        }];
    }

    // returns the numerical value for the day before, eg input 5 (friday) returns 4 (thursday)
    let yesterday = function() {
        if (specificDay - 1 < 0) return 6;
        else return specificDay - 1;
    };

    // returns the numerical value for the day after, eg input 5 (friday) returns 6 (saturday)
    let tommorow = function() {
        if (specificDay + 1 > 6) return 0;
        else return specificDay + 1;
    }

    let sendButtons = function() {
        return new global.discordjs.MessageActionRow()
            // add a close button to the embed
            .addComponents(
                new global.discordjs.MessageButton()
                .setCustomId(`button,today,close`)
                .setLabel("Close")
                .setStyle('DANGER')
            )
            // add a 'day before' button to the embed which edits the original message with the classes for the prior day
            .addComponents(
                new global.discordjs.MessageButton()
                .setCustomId(`button,today,daybefore,${yesterday()}`)
                .setLabel("Day before")
                .setStyle('PRIMARY')
            )
            // add a 'day after' button to the embed which edits the original message with the classes for the following day
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

    // send a new message if no prior one exists
    if (edit === false) message?.author ?? message?.user.send({
        embeds: mainEmbed,
        fetchReply: true,
        components: [sendButtons()],
    });

    // edit the message if any of the buttons are pressed
    else message.edit({
        embeds: mainEmbed,
        fetchReply: true,
        components: [sendButtons()],
    });

    if(slashCommand === true) message.reply({ 
        content:`<@${message.user.id}> We have sent you and interactable message to your dm's!`,
        ephemeral: true
    })

}

exports.command = {
    commandName: 'Today',
    callbackFunction: function(parameters, message, roles, slashCommand) {
        returnClasses(message, undefined, false, slashCommand);
    },
    buttonClickCallback: function(message, interaction, parameters, roles) {
        switch (parameters[2]) {
            case 'close':
                message.delete();
                return;

            case 'daybefore':
                returnClasses(message, parseInt(parameters[3]), true);
                interaction.deferUpdate();
                return;

            case 'dayafter':
                returnClasses(message, parseInt(parameters[3]), true);
                interaction.deferUpdate();
                return;
        }
    },
    canExecInDm: true, // make it so the bot listens for this command in the dm's
    useSlashCommands: true,
    description: 'This command provides you with your next classes for the day.',
    roles: {
        user: global.userRoles,
        buttonRoles: global.userRoles
    },
}