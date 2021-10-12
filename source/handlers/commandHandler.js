const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.commandHandler = async(message) => {
    // If the message dosent begin with the command prefix, return.
    if (message.content.split('')[0] !== config.prefix) return;

    // Splits the message content up into words eg => a b c = ['a','b','c']
    let splitMessage = message.content.split(' ');

    let command = config?.commands[splitMessage[0]?.substring(1)?.toLowerCase()],
        user = new classes.user(message.author.id, message.channel.type === 'DM' ? config.serverid : message.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command?.roles?.user) || config?.devid?.includes(message?.author?.id) || false,
        roles = await user.getRolesName() || undefined;

    if(config.logCommands === true) bot.log(message.author, splitMessage, message?.channel?.type);
    if(message?.channel?.type === 'DM' && command?.executesInDm === false || config?.allowdmcommands === false) return;

    switch(hasPermissions) {
        case true:
            return command.commandCallback(splitMessage, message, { roles, isSlashCommand: false, user });

        case false:
            return message.channel.send({ 
                content: `<@${message.author.id}> You dont have the sufficient privileges to execute this command.`
            });
    }
}