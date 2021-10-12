const bot = require('../source')
let config = bot.getConfig();

let interactables = () => {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageSelectMenu()
            .setCustomId(bot.createCustomID('SpawnClassGroupMsg', { action: 'select' }))
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
    details: {
        commandName: 'SpawnClassGroupMsg',
        commandShortDescription: 'This command spawns in the class group selector.',
    },
    commandCallback: function(parameters, interaction, obj) {
        //Return and throw an error if the cahannel Id provied is incorect
        let channel;
        if(parameters[1] !== undefined) channel = bot.client.channels.cache.get(parameters[1]);
        else channel = interaction.channel;

        let guild = bot.client.guilds.resolve(interaction.guildId);

        if (channel === undefined){
            if(obj.isSlashCommand === true) return interaction.reply({ 
                content:`<@${interaction.user.id}>, Invalid parameter, could not locate the channel.`,
                ephemeral: true
            }); //Inform the user that the command failed
            else return interaction.channel.send({
                content:`<@${interaction.user.id}>, Invalid parameter, could not locate the channel.`,
                fetchReply:true
            }).then((msg) => bot.createTimedDelete(msg, 0.2)); 
        }

        channel.send({
                embeds:[embed()], 
                components: [interactables(interaction.guildId)], 
                fetchReply: true 
            }).then(()=>{
                if(obj.isSlashCommand === true) interaction.reply({
                    content:`<@${interaction.user.id}>, Message sent successfully`,
                    ephemeral: true
                });
                else interaction.delete();
            }).catch(()=>{
                if(obj.isSlashCommand === true) interaction.reply({
                    content:`<@${interaction.user.id}>, Message failed to send`,
                    ephemeral: true
                });
                else interaction.channel.send({
                    content:`<@${interaction.user.id}>, Message failed to send.`,
                });
        });
    },
    menuCallback: function(parameters, interaction, obj){
        let guild = bot.client.guilds.cache.get(interaction.guild.id),
            removeRole = [];

        global.classRoles.forEach(roleName => {
            if(obj.values[0] !== roleName) removeRole = [...removeRole, guild.roles.cache.find(role => role.name.toLowerCase() === roleName)]
        })

        let addRole = guild.roles.cache.find(role => role.name.toLowerCase() === obj.values[0]);
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
                if(err.httpStatus === 403) interaction.followUp('403 Missing Permissions, Please place the bot role above all other roles.');
            });
        });
    },

    executesInDm: false,
    isSlashCommand: true,
    helpEmbedPage: -1,

    roles: {
        user: global.adminRoles,
        button: global.userRoles,
        menu: global.userRoles
    },

    parameters: [
        { type: 'number', name: 'channel', description: 'The id of the cannel you want the message to be sent to', required: false }
    ]
}