const bot = require('../');
let classes = require('../classes');
let config = bot.getConfig();

exports.slashInteractionHandler = async(interaction) =>{
    if(config.allowslashcommands !== true)
        return interaction.reply({ content:'Slash commands are turned off.', ephemeral: true });

    let splitMessage = [interaction.commandName];
    interaction.options._hoistedOptions.forEach(subCommand => splitMessage = [...splitMessage, subCommand.value])

    let command = config?.commands[interaction?.commandName?.toLowerCase()],
        user = new classes.user(interaction.user.id, interaction.guild.id, bot.client),
        hasPermissions = await user.hasRoles(command?.roles?.user) || config.devid.includes(interaction.user.id) || false,
        roles = await user.getRolesName() || undefined;
    
    if(config.logCommands === true) bot.log(interaction.user, splitMessage, interaction?.channel?.type);

    switch(hasPermissions) {
        case true:
            return command.commandCallback(splitMessage, interaction, { roles, isSlashCommand: true});

        case false:
            return interaction.reply({ 
                content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this command.`,
                ephemeral: true 
            });
    }
}