const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.buttonInteractionHandler = async(interaction) => {
    let parameters = bot.decodeCustomID(interaction?.customId),
        command = config?.commands[parameters?.commandName.toLowerCase()],
        user = new classes.user(interaction.user.id, interaction.channel.type === 'DM' ? config.serverid : interaction.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command?.roles?.button) || config.devid.includes(interaction.user.id) || false,
        roles = await user.getRolesName() || undefined;

    if(config.logCommands === true) bot.log(interaction.user, parameters, interaction?.channel?.type);
    if(interaction?.channel?.type === 'DM' && command?.interactionsInDm !== true || config?.allowdminteractions !== true) return interaction.deferUpdate();

    switch(hasPermissions){
        case true:
            return command.buttonCallback(parameters, interaction, { roles });

        case false:
            return interaction.reply({ 
                content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this command.`,
                ephemeral: true 
            });
    }
}