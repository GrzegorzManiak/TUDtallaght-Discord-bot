exports.command = {
    commandName: 'help',
    callbackFunction: function(parameters, message, roles) {
        //Embed for any command with a helpEmbedPage: 0 or none.
        let helpEmbed = {
            color: 0x0099ff,
            title: 'Here are all the available commands!',
            url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
            description: 'To get more info about a command, just type **help** than the command inquestion after it!',
            thumbnail: {
                url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
            },
            fields: [{
                name: '\u200b',
                value: '\u200b',
                inline: false,
            }],
            footer: {
                text: 'Made by Grzegorz M | [help,0]',
                icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
            },
        };

        //Embed for any command with a helpEmbedPage: -1, reserved for admin commands.
        let adminEmbed = {
            color: 0x0099ff,
            title: 'Here are all the available admin commands!',
            url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
            fields: [],
            footer: {
                text: 'Made by Grzegorz M | ',
                icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
            },
        };

        //loop tru every command available.
        let counters = { helpEmbed: 0, adminEmbed: 0 },
            adminHelp = false;

        Object.keys(global.commands).forEach(command => {
            let pass = false,
                commandObj = global.commands[command];

            roles.forEach(role => {
                if (commandObj.roles !== undefined) {
                    //checks if the user has sufficient privileges to view the command.
                    if (commandObj.roles.includes(role)) pass = true;
                } else pass = true
            });

            if (pass === true) {
                let currentEmbed = helpEmbed;
                if (commandObj.helpEmbedPage === undefined || commandObj.helpEmbedPage === 0) {
                    currentEmbed = helpEmbed;
                    count = ++counters.helpEmbed;
                } else if (commandObj.helpEmbedPage === -1) {
                    currentEmbed = adminEmbed;
                    count = ++counters.adminEmbed;
                    adminHelp = true;
                };

                //add command name and description to the embed.
                currentEmbed.fields = [...currentEmbed.fields, {
                    name: `${global.prefix}${commandObj.commandName}`, //Give the help entry a name
                    value: commandObj.description, //Give the help entry a description
                    inline: function() {
                        if (count % 3 === 0) return false; //every seccond item move onto a new line.
                        else return true;
                    }(),
                }];
            }
        });

        //Send out the embed
        message.channel.send({ embeds: [helpEmbed], fetchReply: true }).then(returnedMsg => {
            //add an close reaction to the embed, only if admin page is disabled.
            if (adminHelp === false) returnedMsg.react('❌');
            else if (adminHelp === true) {

                //Add a refrence to the above panel.
                adminEmbed.footer.text += `[help,0,${returnedMsg.id}]`;

                //Send out the embed with admin commands
                message.channel.send({ embeds: [adminEmbed], fetchReply: true }).then(returnedMsg => {

                    //add an close reaction to the embed
                    returnedMsg.react('❌');
                });
            }

        });
    },
    description: 'A command that displays all available commands.',
    roles: [
        'user'
    ]
}