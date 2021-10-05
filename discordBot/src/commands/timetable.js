const bot = require('../index.js')
let config = bot.getConfig();

let sendCloseBtn = function(guild, id) {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageButton()
            .setCustomId(`button,timetable,close,${guild},${id}`)
            .setLabel("Close")
            .setStyle('DANGER')
        );
}

exports.command = {
    commandName: 'TimeTable',
    callbackFunction: function(parameters, message, roles, slashCommand = false) {
        // Im tring to avoid long path chains with process.cwd()
        let timetableHelper = require(process.cwd() + '/helpers/timetable.js'),
            classgroup = roles.find(role => { if(global.classRoles.includes(role)) return role;}),
            userName = message.user ?? message.author,
            embedArray = [],
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
        
        Object.keys(timetable).forEach(day => {
            let dayCompiled = '';
            Object.keys(timetable[day]).forEach(classDetials => {
                classDetials = timetable[day][classDetials];
                dayCompiled += `> **[${classDetials.startTime} - ${classDetials.endTime}]**  ${classDetials.className}, ${function(){
            let constructor = '';
            if(classDetials?.lab === true) constructor += ' Lab ';
            if(classDetials?.support === true) constructor += ' (Support) ';
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
                title: `Here are all your classes for the week, ${userName.tag.charAt(0).toUpperCase() + userName.tag.slice(1)}.`,
                url: global.github,
                thumbnail: {
                    url: global.logo,
                },
                description: '',
                fields: [embedArray],
                footer: {
                    text: `Made by Grzegorz M | [timetable,${classgroup}]`,
                    icon_url: global.logo,
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
        button: global.userRoles
    },
}