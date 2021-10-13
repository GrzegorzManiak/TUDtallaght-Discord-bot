const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.menuInteractionHandler = async(interaction) => {
    let parameters = bot.decodeCustomID(interaction?.customId),
        command = config?.commands[parameters?.commandName.toLowerCase()],
        user = new classes.user(interaction.user.id, interaction.channel.type === 'DM' ? config.serverid : interaction.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command?.roles?.menu) || config.devid.includes(interaction.user.id)  || false,
        roles = await user.getRolesName() || undefined;

    if(command === undefined) return;
    if(config.logCommands === true) bot.log(interaction.user, parameters, interaction?.channel?.type);
    if(interaction?.channel?.type === 'DM' && command?.interactionsInDm !== true || config?.allowdminteractions !== true) return;

    switch(hasPermissions){
        case true:
            return command?.menuCallback(parameters, interaction, { values:interaction.values, roles, user });   

        case false:
            return interaction.reply({ 
                content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this command.`,
                ephemeral: true 
            });
    }
}