const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.commandHandler = async(message) => {
    // If the message dosent begin with the command prefix, return.
    if (message.content.split('')[0] !== config.prefix) return;

    // Splits the message content up into words eg => a b c = ['a','b','c']
    let splitMessage = message.content.split(' ');
    
    let command = config?.commands[splitMessage[0]?.substring(1)?.toLowerCase()],
        user = new classes.user(message.author.id, message.channel.type === 'DM' ? message.author.id : message.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command.roles.user) || config.devid.includes(interaction.user.id),
        roles = await user.getRolesName();
    
    switch(hasPermissions) {
        case true:
            // check if the command can be executed in the dms
            if (command?.executesInDm !== true && message.channel.type === 'DM') return;
            return command.commandCallback(splitMessage, message, { roles, isSlashCommand: false});

        default:
            return message.channel.send(`<@${message.author.id}> You dont have the sufficient privileges to execute this command.`);
    }
}