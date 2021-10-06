const bot = require('../index.js')
let config = bot.getConfig();

// Embed for any command with a helpEmbedPage: 0 or none.
const helpEmbedTemplate = {
    color: 0x0099ff,
    title: 'Here are all the available commands!',
    url: global.github,
    description: 'To get more info about a command, just type **help** than the command inquestion after it!',
    thumbnail: {
        url: global.logo,
    },
    fields: [{
        name: '\u200b',
        value: '\u200b',
        inline: false,
    }],
    footer: {
        text: 'Made by Grzegorz M | [help,0]',
        icon_url: global.logo,
    },
};

// Embed for any command with a helpEmbedPage: -1, reserved for admin commands.
const adminEmbedTemplate = {
    color: 0x0099ff,
    title: 'Here are all the available admin commands!',
    url: global.github,
    fields: [],
    footer: {
        text: 'Made by Grzegorz M | ',
        icon_url: global.logo,
    },
};

const sendCloseBtn = function(guild, id) {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageButton()
            .setCustomId(`button,help,close,${guild},${id}`)
            .setLabel("Close")
            .setStyle('DANGER')
        );
}

exports.command = {
    commandName: 'Help',
    callbackFunction: function(parameters, message, roles, slashCommand) {
        //clone the embed templates so that we dont edit it directly
        let adminEmbed = Object.assign({}, adminEmbedTemplate);
            helpEmbed = Object.assign({}, helpEmbedTemplate),
            user = message.user ?? message.author;

        let prefix = function(){
            if(config.allowslashcommands === true) return '/';
            else return config.prefix;
        }

        // loop tru every command available.
        let counters = { helpEmbed: 0, adminEmbed: 0 },
            adminHelp = false;

        Object.keys(config.commands).forEach(command => {
            let pass = false,
                commandObj = config.commands[command],
                commandObjRoles = [...commandObj.roles.user ?? [], ...config.roles.admin]

            // for each role that the user has
            roles.forEach(role => {
                // check if the command in qustion requires any special roles, if not, let the user continue
                if (commandObjRoles !== undefined) {
                    // checks if the user has sufficient privileges to view the command.
                    if (commandObjRoles.includes(role) || config.devid.includes(user.id) === true) pass = true;
                } else pass = true
            });

            //--// If the user lacks premisions, continue onto the next command
            if (pass !== true) return;

            let currentEmbed = helpEmbed;
            if (commandObj.helpEmbedPage === undefined || commandObj.helpEmbedPage === 0) { // Helpembed
                currentEmbed = helpEmbed; // set the current embed to that of the base embed
                count = ++counters.helpEmbed;
            } else if (commandObj.helpEmbedPage === -1) { // adminEmbed
                currentEmbed = adminEmbed; // set the current embed to that of the admin embed
                count = ++counters.adminEmbed;
                adminHelp = true;
            };

            // add command name and description to the embed.
            currentEmbed.fields = [...currentEmbed.fields, {
                name: `${prefix()}${commandObj.commandName}`, // Give the help entry a name
                value: commandObj.description, // Give the help entry a description
                inline: function() {
                    if (count % 3 === 0) return false; // every seccond item move onto a new line.
                    else return true;
                }(),
            }];

        });

        switch(slashCommand){
            case true:
                // Send out the embed
                message.reply({ embeds: [helpEmbed], ephemeral: true }).then(() => {
                   if(adminHelp === true) message.followUp({ embeds: [adminEmbed], ephemeral: true });
                });
                break;

            case false:
                message.channel.send({ embeds: [helpEmbed], fetchReply: true }).then(returnedMsg => {
                    // remove the msg that called the command.
                    if (message.channel.type === 'GUILD_TEXT') {
                        // delete the msg in 2 min unlesss its the dm's
                        bot.createTimedDelete(returnedMsg, 2);
                        message.delete();
                    }
        
                    // add an close reaction to the embed, only if admin page is disabled.
                    if (adminHelp === false) returnedMsg.edit({ components: [sendCloseBtn(message.guildId, returnedMsg.id)] })
                    else if (adminHelp === true) {
        
                        // Add a refrence to the above panel.
                        adminEmbed.footer.text = `Made by Grzegorz M | [help,0,${returnedMsg.id}]`;
        
                        // Send out the embed with admin commands
                        message.channel.send({ embeds: [adminEmbed], components: [sendCloseBtn(message.guildId, returnedMsg.id)], fetchReply: true }).then(returnedMsg => {
        
                            // delete the msg in 2 min unlesss its the dm's
                            if (message.channel.type === 'GUILD_TEXT') bot.createTimedDelete(returnedMsg, 2);
                        });
                    }
                });
                break;
        }
    },

    buttonClickCallback: function(message, interaction, parameters, roles) {
        if (parameters[2] !== 'close') return;

        message.embeds.forEach(embed => {
            // grab the command refrence at the footer of every embed
            // check if the message has a child
            let childRefrence = /\[(.+)\]/gm.exec(embed.footer.text)[1].split(',')[2];
            if (childRefrence === undefined) return;

            // delete its children
            message.channel.messages.fetch(childRefrence)
                .then(message => message.delete()).catch(err => {});
        });

        message.delete();
    },

    canExecInDm: true,
    useSlashCommands: true,
    description: 'A command that displays all available commands.',
    roles: {
        user: global.userRoles,
        button: global.userRoles
    },
}