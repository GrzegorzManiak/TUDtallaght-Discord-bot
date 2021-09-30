let helpEmbed = function(roleName) {
    return {
        color: 0x0099ff,
        title: 'Verify your email to gain access to all the features of this bot!',
        url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
        description: 'Welcome to the TUD Tallaght campus discord server! \n Please react with the mail emoji, than I\'ll send you a link in your dm\'s to verify your student email.',
        thumbnail: {
            url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
        },
        footer: {
            text: `Made by Grzegorz M | [spawnAuthMsg,${roleName}]`,
            icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
        },
    }
};

exports.command = {
    commandName: 'spawnAuthMsg',
    callbackFunction: function(parameters, message, roles, allRoles = []) {
        //Return and throw an error if the cahannel Id provied is incorect
        let channel = global.client.channels.cache.get(parameters[1]);
        if (channel === undefined)
            return message.channel.send('Invalid parameter, could not locate the channel.'); //Inform the user that the command failed

        //Return and throw an error if the provided role is incorect
        global.client.guilds.resolve(message.guildId).roles.cache.map(m => allRoles = [...allRoles, m.name]);
        if (parameters[2] === undefined || allRoles.includes(parameters[2]) === false)
            return message.channel.send('Invalid parameter, could not locate role.'); //Inform the user that the command failed

        //Send out the embed
        channel.send({ embeds: [helpEmbed(parameters[2])], fetchReply: true }).then(returnedMsg => {
            //add an reaction to the embed
            returnedMsg.react('📧');
        });
    },

    reactionAddCallback: function(reactionEmojie, message, roles) {
        console.log(reactionEmojie)
    },
    helpEmbedPage: -1,
    description: 'This command spawns the auth msg for users to link their accs.',
    roles: [
        'test'
    ],
    reactionRoles: [
        'user'
    ]
}