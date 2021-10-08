const bot = require('../');
let config = bot.getConfig();

exports.commandHandler = async(message) => {
    // If the message dosent begin with the command prefix, return.
    if (message.content.split('')[0] !== config.prefix) return;

    // Splits the message content up into words eg => a b c = ['a','b','c']
    let splitMessage = message.content.split(' ');

    // gives us the acutal command name by getting the first word and dropping the prefix character
    let command = config.commands[splitMessage[0].substring(1).toLowerCase()];

    // check if the command can be executed in the dms
    if (command?.executesInDm !== true && message.channel.type === 'DM') return;

    // grab the current user
    let member,
        roles = []

    // check if the message is comming from a guild or a dm channel
    if (message.channel.type === 'GUILD_TEXT') member = message.guild.members.cache.get(message.author.id);
    else {
        let guild = bot.client.guilds.cache.get(config.serverid);
        member = await guild.members.fetch(message.author.id);
    }

    // get all the users roles and add them the the 'roles' array
    member.roles.cache.map(m => roles = [...roles, m.name.toLowerCase()]);

    if (config.devid.includes(message.author.id) === false && bot.hasPermissions(roles, [...command?.roles?.user, ...config.roles.admin]) === false) message.channel.send(`<@${message.author.id}> You dont have the sufficient privileges to execute this command.`);
    else command.commandCallback(splitMessage, message, { roles, isSlashCommand: false })
}