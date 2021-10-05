const bot = require('../index.js')
let config = bot.getConfig();

function returnClasses(message, specificDay, edit = false, slashCommand, roles) {
    // Im tring to avoid long path chains with process.cwd()
    let timetableHelper = require(process.cwd() + '/helpers/timetable.js'),
        classgroup = roles.find(role => { if(global.classRoles.includes(role)) return role;}),
        userName = message.user ?? message.author,
        timetable = [];

    switch(classgroup){
        case global.classRoles[0]: timetable = timetableHelper.a1; break;
        case global.classRoles[1]: timetable = timetableHelper.a2; break;
        case global.classRoles[2]: timetable = timetableHelper.b1; break;
        case global.classRoles[3]: timetable = timetableHelper.b2; break;
        default: classgroup = null;
    }

    if(classgroup === null){
        switch(slashCommand){
            case true:
                message.reply({
                    content: `<@${userName.id}>, You are not registerd under any class groups.`,
                    ephemeral: true
                });
                return;

            case false:
                userName.send(`<@${userName.id}>, You are not registerd under any class groups.`)
                message.delete();
                return;
        }
    }

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
        title = `You do not have any classes on ${selectedDay[1]}, ${userName.tag.charAt(0).toUpperCase() + userName.tag.slice(1)}.`

        // add content to the embed array stateing that there's no classes for the selectedDay
        embedArray = [{
            name: `Just sit back and enjoy the day`,
            value: 'If you belive that this is a mistake, and you do indeed have classes today, please contact Gregor.',
            inline: false,
        }];
    } else {
        // set the title of the main embed
        title = `Your classes for ${selectedDay[1]}, ${userName.tag.charAt(0).toUpperCase() + userName.tag.slice(1)}.`

        // iterate tru each class in that day, format them and add them to an array
        selectedDay[0].forEach(classDetials => {
            dayCompiled += `> **[${classDetials.startTime} - ${classDetials.endTime}]**  ${classDetials.className}, ${function(){
            let constructor = '';
            if(classDetials?.lab === true) constructor += ' Lab ';
            if(classDetials?.support === true) constructor += ' (Support) ';
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
        return new bot.discordjs.MessageActionRow()
            // add a close button to the embed
            .addComponents(
                new bot.discordjs.MessageButton()
                .setCustomId(`button,today,close`)
                .setLabel("Close")
                .setStyle('DANGER')
            )
            // add a 'day before' button to the embed which edits the original message with the classes for the prior day
            .addComponents(
                new bot.discordjs.MessageButton()
                .setCustomId(`button,today,daybefore,${yesterday()}`)
                .setLabel("Day before")
                .setStyle('PRIMARY')
            )
            // add a 'day after' button to the embed which edits the original message with the classes for the following day
            .addComponents(
                new bot.discordjs.MessageButton()
                .setCustomId(`button,today,dayafter,${tommorow()}`)
                .setLabel("Day after")
                .setStyle('PRIMARY')
            );
    }

    let mainEmbed = [{
        color: 0x0099ff,
        title,
        url: global.github,
        thumbnail: {
            url: global.logo,
        },
        description: '',
        fields: [embedArray],
        footer: {
            text: `Made by Grzegorz M | [today,${classgroup}]`,
            icon_url: global.logo,
        },
    }];


    // send a new message if no prior one exists
    if (edit === false) {
        let user = message.author ?? message.user;
        user.send({
            embeds: mainEmbed,
            fetchReply: true,
            components: [sendButtons()],
        });

        switch(slashCommand){
            case true:
                message.reply({ 
                    content:`<@${message.user.id}> We have sent you and interactable message to your dm's!`,
                    ephemeral: true
                });
                break;
    
            case false:
                if(message.channel.type !== 'GUILD_TEXT') break;
                message.channel.send({
                    content:`<@${message.author.id}> We have sent you and interactable message to your dm's!`,
                    fetchReply: true
                }).then((msg)=>{
                    bot.createTimedDelete(msg, 0.2);
                });
                break;
        }
    }
    // edit the message if any of the buttons are pressed
    else { 
        message.edit({
            embeds: mainEmbed,
            fetchReply: true,
            components: [sendButtons()],
        });
    }
}

exports.command = {
    commandName: 'Today',
    callbackFunction: function(parameters, message, roles, slashCommand) {
        returnClasses(message, undefined, false, slashCommand, roles);
    },
    buttonClickCallback: function(message, interaction, parameters, roles) {
        switch (parameters[2]) {
            case 'close':
                message.delete();
                return;

            case 'daybefore':
                message.user = interaction.user;
                returnClasses(message, parseInt(parameters[3]), true, false, roles);
                interaction.deferUpdate();
                return;

            case 'dayafter':
                message.user = interaction.user;
                returnClasses(message, parseInt(parameters[3]), true, false, roles);
                interaction.deferUpdate();
                return;
        }
    },
    canExecInDm: true, // make it so the bot listens for this command in the dm's
    useSlashCommands: true,
    description: 'This command provides you with your next classes for the day.',
    roles: {
        user: global.userRoles,
        button: global.userRoles
    },
}