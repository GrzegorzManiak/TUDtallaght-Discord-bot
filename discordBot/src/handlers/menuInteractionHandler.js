const bot = require('../');
let config = bot.getConfig();

exports.menuInteractionHandler = async(interaction) => {
    let id = interaction.customId;
    if (id === undefined) return;
    let parameters = id.split(',');

    let roles = [],
        command = parameters[1].toLowerCase();

    if(config?.commands[command] === undefined) return;
    else command = config.commands[command];

    let guild = bot.client.guilds.cache.get(config.serverid);
    let member = await guild.members.fetch(interaction.user.id);
    
    // get all the users roles and add them the the 'roles' array
    member.roles.cache.map(m => roles = [...roles, m.name.toLowerCase()]);

    if (config.devid.includes(interaction.user.id) === false && bot.hasPermissions(roles, [...command?.roles?.menu, ...config.roles.admin]) !== true) interaction.reply({ 
        content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this command.`,
        ephemeral: true 
    });
    else command?.menuCallbackFunction(parameters, interaction, interaction.values);   
}