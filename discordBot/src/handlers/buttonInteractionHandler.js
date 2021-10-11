const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.buttonInteractionHandler = async(interaction) => {
    let parameters = bot.decodeCustomID(interaction?.customId),
        command = config?.commands[parameters?.commandName.toLowerCase()],
        user = new classes.user(interaction.user.id, interaction.channel.type === 'DM' ? config.serverid : interaction.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command.roles.user) || config.devid.includes(interaction.user.id),
        roles = await user.getRolesName();

    if(interaction.channel.type === 'DM' && command.executesInDm !== true) return interaction.deferUpdate();

    switch(hasPermissions){
        case true:
            return command.buttonCallback(parameters, interaction, { roles });

        default:
            return interaction.deferUpdate();
    }
}