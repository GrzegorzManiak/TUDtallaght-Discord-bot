const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.menuInteractionHandler = async(interaction) => {
    let parameters = bot.decodeCustomID(interaction?.customId),
        command = config?.commands[parameters?.commandName.toLowerCase()],
        user = new classes.user(interaction.user.id, interaction.channel.type === 'DM' ? config.serverid : interaction.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command.roles.user) || config.devid.includes(interaction.user.id),
        roles = await user.getRolesName();

    if(interaction.channel.type === 'DM' && command.executesInDm !== true) return;

    switch(hasPermissions){
        case true:
            return command?.menuCallback(parameters, interaction, { values:interaction.values, roles });   

        case false:
            return interaction.reply({ 
                content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this command.`,
                ephemeral: true 
            });
    }
}