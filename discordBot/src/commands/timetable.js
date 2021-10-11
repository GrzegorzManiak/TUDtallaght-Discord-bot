const bot = require('../index.js')
let config = bot.getConfig();

let sendCloseBtn = function(guild, id) {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageButton()
            .setCustomId(bot.createCustomID('timetable', { action: 'close' }))
            .setLabel("Close")
            .setStyle('DANGER')
        );
}

exports.command = {
    details: {
        commandName: 'Timetable',
        commandShortDescription: 'This command provides you with your timetable.',
    },
    commandCallback: function(parameters, message, obj = { isSlashCommand:false }) {
        // Im tring to avoid long path chains with process.cwd()
        let timetableHelper = require(process.cwd() + '\\discordBot\\helpers\\timetable.js'),
            classgroup = obj.roles.find(role => { if(global.classRoles.includes(role)) return role;}),
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
            switch(obj.isSlashCommand){
                case true: // If the user sends out a slash command, reply with an ephemeral msg
                    message.reply({
                        content: `<@${userName.id}>, You are not registerd under any class groups.`,
                        ephemeral: true
                    });
                    return;

                case false: // Otherwise, reply to them in the DM's and remove the spawning command.
                    userName.send(`<@${userName.id}>, You are not registerd under any class groups.`)
                    message.delete().catch(()=>{});;
                    return;
            }
        }
        
        // delete the msg that called the command if its in a server, not a dm.
        if (message.channel.type === 'GUILD_TEXT' && obj.isSlashCommand === false) message.delete().catch(()=>{});;
        
        Object.keys(timetable).forEach(day => {
            let dayCompiled = '';
            Object.keys(timetable[day]).forEach(classDetials => {
                classDetials = timetable[day][classDetials];
                dayCompiled += `> **[${classDetials.startTime} - ${classDetials.endTime}]**  ${classDetials.className}, ${function(constructor = ''){
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

        switch(obj.isSlashCommand){
            case true:
                msgContent.ephemeral = true;
                msgContent.components = [];
                message.reply(msgContent)
                return;

            case false:
                message.author.send(msgContent);
                if(message.channel.type !== 'GUILD_TEXT') break;

                message.channel.send({
                    content:`<@${message.author.id}> We have sent your timetable to your dm's!`,
                    fetchReply: true
                }).then((msg)=>{
                    bot.createTimedDelete(msg, 0.2);
                });
                return;
        }
    },

    buttonCallback: function(parameters, interaction, obj) {
        // If the close button is clicked, delete the msg
        if (parameters.action === 'close') interaction.message.delete().catch(()=>{});
    },

    executesInDm: true,
    isSlashCommand: true,
    
    roles: {
        user: global.userRoles,
        button: global.userRoles
    },
}