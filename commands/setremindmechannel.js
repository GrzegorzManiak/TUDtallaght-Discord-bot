const bot = require('../source')
let config = bot.getConfig();

exports.command = {
    details: {
        commandName: 'setremindmechannel',
        commandShortDescription: 'This command sets the remindMe channel.',
    },

    commandCallback: async function(parameters, interaction, obj = { isSlashCommand: false }) {
        let channel,
            user = await obj.user.getUser();

        if(parameters[1] !== undefined) channel = bot.client.channels.cache.get(parameters[1]);
        else channel = interaction.channel;

        if (channel === undefined){
            if(obj.isSlashCommand === true) return interaction.reply({ 
                content:`<@${user.id}>, Invalid parameter, could not locate the channel.`,
                ephemeral: true
            }); //Inform the user that the command failed
            else return interaction.channel.send({
                content:`<@${user.id}>, Invalid parameter, could not locate the channel.`,
                fetchReply:true
            }).then((msg) => bot.createTimedDelete(msg, 0.2)); 
        }

        let currentEntry = global.settings.get(setting => setting.remindMe !== undefined | null); 
        if(currentEntry === null) global.settings.create({ remindMe: channel.id });
        else global.settings.update({ remindMe: channel.id }, setting => setting.remindMe !== undefined | null);

        if(obj.isSlashCommand === true) return interaction.reply({ 
            content:`<@${user.id}>, Success.`,
            ephemeral: true
        }); //Inform the user that the command failed
        else return interaction.channel.send({
            content:`<@${user.id}>, Success.`,
            fetchReply:true
        }).then((msg) => bot.createTimedDelete(msg, 0.2)); 
    },

    executesInDm: false,
    isSlashCommand: true,
    helpEmbedPage: -1,

    roles: {
        user: global.adminRoles,
    },

    parameters: [
        { type: 'number', name: 'channel', description: 'The id of the cannel you want the remindme messages to be sent to', required: true }
    ]
}