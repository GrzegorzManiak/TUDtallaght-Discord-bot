const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.slashInteractionHandler = async(interaction) =>{
    if(config.useSlashCommands !== true)
        return interaction.reply({content:'Slash commands are turned off.', ephemeral: true});

    let command = config?.commands[interaction?.commandName?.toLowerCase()],
        user = new classes.user(interaction.user.id, interaction.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command.roles.user) || config.devid.includes(interaction.user.id),
        roles = await user.getRolesName();

    if(interaction.channel.type === 'DM' && command.executesInDm !== true) return;

    switch(hasPermissions) {
        case true:
            let splitMessage = [interaction.commandName];
            interaction.options._hoistedOptions.forEach(subCommand => splitMessage = [...splitMessage, subCommand.value])
            return command.commandCallback(splitMessage, interaction, { roles, isSlashCommand: true});

        default:
            return interaction.reply({ 
                content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this command.`,
                ephemeral: true 
            });
    }
}