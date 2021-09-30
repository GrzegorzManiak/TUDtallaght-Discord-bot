exports.command = {
    commandName: 'spawnAuthMsg',
    callbackFunction: function(parameters, message, roles, allRoles = []) {

        //Return and throw an error if the cahannel Id provied is incorect
        let channel = global.client.channels.cache.get(parameters[1]);
        if (channel === undefined) {
            message.channel.send('Invalid parameter, could not locate the channel.');
            return
        }

        //Return and throw an error if the provided role is incorect
        global.client.guilds.resolve(message.guildId).roles.cache.map(m => allRoles = [...allRoles, m.name]);
        if (parameters[2] === undefined || allRoles.includes(parameters[2]) === false) {
            message.channel.send('Invalid parameter, could not locate role.');
            return;
        }

        let helpEmbed = {
            color: 0x0099ff,
            title: 'Verify your email to gain access to all the features of this bot!',
            url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
            description: 'Welcome to the TUD Tallaght campus discord server! \n Please react with the mail emoji, than I\'ll send you a link in your dm\'s to verify your student email.',
            thumbnail: {
                url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
            },
            footer: {
                text: `Made by Grzegorz M | [spawnAuthMsg,${parameters[2]}]`,
                icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
            },
        };

        //Send out the embed
        channel.send({ embeds: [helpEmbed], fetchReply: true }).then(returnedMsg => {
            //add an reaction to the embed
            returnedMsg.react('📧');
        });
    },
    helpEmbedPage: -1,
    description: 'This command spawns the auth msg for users to link their accs.',
    roles: [
        'test'
    ]
}