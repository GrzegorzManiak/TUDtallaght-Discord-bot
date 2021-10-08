const bot = require('../index.js')
let config = bot.getConfig();

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

let email = function(guild) {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageButton()
            .setCustomId(`button,spawnauthmsg,verify,${guild}`)
            .setLabel("Verify")
            .setStyle('PRIMARY')
        );
}

let link = function(url) {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageButton()
            .setLabel("Open verification page")
            .setStyle('LINK')
            .setURL(url)
        );
}

async function getLinkAndSend(interaction, id = '') {
    // [TODO] Check mongodb if user is already verified.
    // check if the user has previously clicked 'verify'
    let checkPrev = global.cache.get(interaction.user.id);
    if (checkPrev !== undefined) id = checkPrev[0];
    else {
        let random = (length = 50) => Math.random().toString(15).substr(1, length);
        id = interaction.user.id.concat(random());

        // add the users detials to cache for 15 mins.
        global.cache.set(id, [interaction.user.id, interaction.user.tag], 900);
        global.cache.set(interaction.user.id, [id], 900);
    }

    interaction.reply({
        content: 'To verify, please click the button below, This link will be active for 15 Minutes.',
        components: [link('https://tallaght.gregs.software/?identifier='.concat(id))],
        ephemeral: true
    });
}

exports.command = {
    details: {
        commandName: 'SpawnAuthMsg',
        commandShortDescription: 'This command spawns the auth msg for users to link their accs.',
    },
    commandCallback: function(parameters, interaction, obj, allRoles = []) {
        //Return and throw an error if the cahannel Id provied is incorect
        let channel = bot.client.channels.cache.get(parameters[1]);
        let guild = bot.client.guilds.resolve(interaction.guildId);

        if (channel === undefined){
            if(obj.isSlashCommand === true) return interaction.reply({ 
                content:'Invalid parameter, could not locate the channel.',
                ephemeral: true
            }); //Inform the user that the command failed
            else return interaction.channel.send({
                content:'Invalid parameter, could not locate the channel.',
                fetchReply:true
            }).then((msg) => bot.createTimedDelete(msg, 0.2)); 
        }

        //Return and throw an error if the provided role is incorect
        guild.roles.cache.map(m => allRoles = [...allRoles, m.name]);
        if (parameters[2] === undefined || allRoles.includes(parameters[2]) === false){
            if(obj.isSlashCommand === true) return interaction.reply({ 
                content:'Invalid parameter, could not locate role.',
                ephemeral: true
            }); //Inform the user that the command failed
            else return interaction.channel.send({
                content: 'Invalid parameter, could not locate role.',
                fetchReply:true
            }).then((msg) => bot.createTimedDelete(msg, 0.2));
        }

        //Send out the embed
        channel.send({
            embeds: [helpEmbed(parameters[2])],
            components: [email(interaction.guildId)],
            fetchReply: true
        }).then(() => {
            if(obj.isSlashCommand === true) interaction.reply({ content:'Authentication msg spawned in successfully', fetchReply:true }).then(msg =>{msg.delete();});
            else interaction.delete();
        });
    },

    buttonCallback: function(parameters, interaction, obj) {
        getLinkAndSend(interaction);
    },

    isSlashCommand: true,
    executesInDm: false,
    helpEmbedPage: -1,

    roles: {
        user: global.adminRoles,
        button: global.userRoles
    },

    parameters: [
        { type: 'number', name: 'channel', description: 'The id of the cannel you want the message to be sent to', required: true },
        { type: 'string', name: 'role', description: 'The name of the role you want to give upon verification', required: true }
    ]
}