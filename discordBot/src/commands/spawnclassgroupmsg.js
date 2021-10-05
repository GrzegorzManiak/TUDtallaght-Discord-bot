const bot = require('../index.js')
let config = bot.getConfig();

let interactables = (guild) => {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageSelectMenu()
            .setCustomId(`button,spawnclassgroupmsg,select,${guild}`)
            .addOptions([
                { label: 'Group 1A1', value: global.classRoles[0] },
                { label: 'Group 1A2', value: global.classRoles[1] },
                { label: 'Group 1B1', value: global.classRoles[2] },
                { label: 'Group 1B2', value: global.classRoles[3] }
            ])
        );
}

let embed = () => {
    return {
        color: 0x0099ff,
        title: 'Select your class group from the dropdown below.',
        description: 'By selecting your class group youll get access to the timetable related commands.',
        url: global.github,
        thumbnail: {
            url: global.logo,
        },
        fields: [],
        footer: {
            text: 'Made by Grzegorz M | [spawnclassgroupmsg]',
            icon_url: global.logo,
        },
    }
}

exports.command = {
    commandName: 'SpawnClassGroupMsg',
    callbackFunction: function(parameters, message, roles, slashCommand) {
        //Return and throw an error if the cahannel Id provied is incorect
        let channel;
        if(parameters[1] !== undefined) channel = bot.client.channels.cache.get(parameters[1]);
        else channel = message.channel;

        let guild = bot.client.guilds.resolve(message.guildId);

        if (channel === undefined){
            if(slashCommand === true) return message.reply({ 
                content:`<@${message.user.id}>, Invalid parameter, could not locate the channel.`,
                ephemeral: true
            }); //Inform the user that the command failed
            else return message.channel.send({
                content:`<@${message.user.id}>, Invalid parameter, could not locate the channel.`,
                fetchReply:true
            }).then((msg) => bot.createTimedDelete(msg, 0.2)); 
        }

        channel.send({
                embeds:[embed()], 
                components: [interactables(message.guildId)], 
                fetchReply: true 
            }).then(()=>{
                if(slashCommand === true) message.reply({
                    content:`<@${message.user.id}>, Message sent successfully`,
                    ephemeral: true
                });
                else message.delete();
            }).catch(()=>{
                if(slashCommand === true) message.reply({
                    content:`<@${message.user.id}>, Message failed to send`,
                    ephemeral: true
                });
                else message.channel.send({
                    content:`<@${message.user.id}>, Message failed to send.`,
                });
        });
    },
    menuCallbackFunction: function(parameters, interaction, values){
        let guild = bot.client.guilds.cache.get(interaction.guild.id),
            removeRole = [];

        global.classRoles.forEach(roleName => {
            if(values[0] !== roleName) removeRole = [...removeRole, guild.roles.cache.find(role => role.name.toLowerCase() === roleName)]
        })

        let addRole = guild.roles.cache.find(role => role.name.toLowerCase() === values[0]);
        guild.members.fetch(interaction.user.id).then((user)=>{
            user.roles.remove(removeRole).then(()=>{
                user.roles.add(addRole)
                .then(()=>{
                    interaction.reply({ 
                        content:`<@${interaction.user.id}>, Successfully updated your role!`,
                        ephemeral: true
                    });
                })
                .catch((err)=>{
                    interaction.reply({ 
                        content:`<@${interaction.user.id}>, Failed to update your role!`,
                        ephemeral: true
                    });
                    if(err.httpStatus === 403) interaction.followUp('403 Missing Permissions, Please place the bot role above all other roles.')
                    return;
                })
            }).catch((err)=>{
                interaction.reply({ 
                    content:`<@${interaction.user.id}>, Failed to update your role!`,
                    ephemeral: true
                });
            });
        });
    },
    canExecInDm: false,
    useSlashCommands: true,
    helpEmbedPage: -1,
    description: 'This command spawns in the class group selector.',
    roles: {
        user: global.adminRoles,
        button: global.userRoles,
        menu: global.userRoles
    },
    slashParams:[
        ['number', 'channel', 'The id of the cannel you want the message to be sent to', false]
    ]
}