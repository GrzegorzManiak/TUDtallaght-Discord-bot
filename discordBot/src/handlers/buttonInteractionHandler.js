const bot = require('../');
let config = bot.getConfig();

exports.buttonInteractionHandler = async(interaction) => {
     //TODO// MAKE ALL CUSTOM ID'S INTO JSON THAN ENCODE THEM IN BASE64.
    let id = interaction.customId;
    if (id === undefined) return;
    let parameters = id.split(',');

    command = config?.commands[parameters[1].toLowerCase()];

    // check if the command exists
    if (command === undefined) return;

    // grab the current user
    let member,
        roles = []

    if (interaction.channel.type === 'GUILD_TEXT') member = interaction.guild.members.cache.get(interaction.user.id);
    else {
        let guild = bot.client.guilds.cache.get(config.serverid);
        member = await guild.members.fetch(interaction.user.id);
        if(member === undefined) return;
    }

    // get all the users roles and add them the the 'roles' array
    member.roles.cache.map(m => roles = [...roles, m.name.toLowerCase()]);

    // Check if the user containts the right premisions to react
    if (config.devid.includes(interaction.user.id) === false && bot.hasPermissions(roles, [...command.roles.button, ...command.roles.user, ...config.roles.admin]) !== true) return;
    return command.buttonCallback(parameters, interaction, { roles });
}