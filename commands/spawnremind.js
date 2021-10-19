const bot = require('../source')
let config = bot.getConfig();

let interactables = () => {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageSelectMenu()
            .setCustomId(bot.createCustomID('spawnremind', { action: 'select' }))
            .addOptions([
                { label: 'Dont remind me', value: 'false' },
                { label: 'As the class starts', value: '0' },
                { label: '5 Min Before', value: '5' },
                { label: '10 Min Before', value: '10' },
                { label: '15 Min Before', value: '15' },
                { label: '20 Min Before', value: '20' },
                { label: '25 Min Before', value: '25' },
                { label: '30 Min Before', value: '30' }
            ])
        );
}

let embed = () => {
    return {
        color: 0x0099ff,
        title: 'Do you want to be reminded before each class?',
        url: global.github,
        thumbnail: {
            url: global.logo,
        },
        description: 'If so, you can select how much time before hand.',
        footer: {
            text: `Made by Grzegorz M | [SpawnRemind]`,
            icon_url: global.logo,
        },
    };
}

exports.command = {
    details: {
        commandName: 'SpawnRemind',
        commandShortDescription: 'This command reminds you of your class some time before it starts.',
    },

    commandCallback: async function(parameters, interaction, obj = { isSlashCommand: false }) {
        let channel,
            user = await obj.user.getUser();

        if (parameters[1] !== undefined) channel = bot.client.channels.cache.get(parameters[1]);
        else channel = interaction.channel;

        if (channel === undefined) {
            if (obj.isSlashCommand === true) return interaction.reply({
                content: `<@${user.id}>, Invalid parameter, could not locate the channel.`,
                ephemeral: true
            }); //Inform the user that the command failed
            else return interaction.channel.send({
                content: `<@${user.id}>, Invalid parameter, could not locate the channel.`,
                fetchReply: true
            }).then((msg) => bot.createTimedDelete(msg, 0.2));
        }

        channel.send({
            embeds: [embed()],
            components: [interactables()],
            fetchReply: true
        }).then(() => {
            if (obj.isSlashCommand === true) interaction.reply({
                content: `<@${interaction.user.id}>, Message sent successfully`,
                ephemeral: true
            });
            else interaction.delete();
        }).catch(() => {
            if (obj.isSlashCommand === true) interaction.reply({
                content: `<@${interaction.user.id}>, Message failed to send`,
                ephemeral: true
            });
            else interaction.channel.send({
                content: `<@${interaction.user.id}>, Message failed to send.`,
            });
        });
    },

    menuCallback: async function(parameters, interaction, obj) {
        let classgroupname = undefined;
        classgroup = obj.roles.find(role => { if (global.classRoles.includes(role.toLowerCase())) return classgroupname = role.toLowerCase() });

        if (classgroupname === undefined) return interaction.reply({
            content: `<@${interaction.user.id}>, You are not registerd under any class groups.`,
            ephemeral: true
        });

        let currentEntry = global.users.get(user => user.userid === interaction.user.id);
        if (currentEntry === null) global.users.create({ userid: interaction.user.id, group: classgroupname, alertme: parseInt(obj.values[0]) });
        else global.users.update({ alertme: parseInt(obj.values[0]), group: classgroupname }, user => user.userid === interaction.user.id);

        let reply = '';
        if (obj.values[0] === 'false') reply = `<@${interaction.user.id}>, We will no longer remind you of your upcomming classes.`;
        else if (obj.values[0] === '0') reply = `<@${interaction.user.id}>, We will remind you of your classes as they start.`;
        else reply = `<@${interaction.user.id}>, We will remind you **${obj.values[0]}** Min before each class!.`;

        interaction.reply({
            content: reply,
            ephemeral: true
        });
    },

    executesInDm: false,
    isSlashCommand: true,
    helpEmbedPage: -1,

    roles: {
        user: global.adminRoles,
        menu: global.userRoles
    },

    parameters: [
        { type: 'number', name: 'channel', description: 'The id of the cannel you want the message to be sent to', required: false }
    ]
}