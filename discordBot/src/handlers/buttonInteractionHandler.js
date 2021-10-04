const bot = require('../');
let config = bot.getConfig();

exports.buttonInteractionHandler = async(interaction) => {
    let id = interaction.customId;
    if (id === undefined) return;
    let parameters = id.split(',');

    // Load the msg in if its not cached
    const message = !interaction.message.author ?
        await interaction.message.fetch() :
        interaction.message;

    command = config.commands[parameters[1].toLowerCase()];

    // check if the command exists
    if (command === undefined) return;

    // grab the current user
    let member,
        roles = []

    if (message.channel.type === 'GUILD_TEXT') member = interaction.guild.members.cache.get(interaction.user.id);
    else {
        let guild = bot.client.guilds.cache.get(global.serverid);
        member = await guild.members.fetch(interaction.user.id);
        if(member === undefined) return;
    }

    // get all the users roles and add them the the 'roles' array
    member.roles.cache.map(m => roles = [...roles, m.name.toLowerCase()]);

    // Check if the user containts the right premisions to react
    if (bot.hasPermissions(roles, [...command.roles.buttonRoles, ...command.roles.user, ...config.roles.admin]) !== true) return;
    return command.buttonClickCallback(message, interaction, parameters, roles);
}