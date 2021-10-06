const bot = require('../');
let config = bot.getConfig();

exports.reactionHandler = async(reaction, user, removeReaction, roles = []) => {
    // Load the msg in if its not cached
    const message = !reaction.message.author ?
        await reaction.message.fetch() :
        reaction.message;

    // if its a reaction to anything else than the bot, ignore it.
    if (message.author.id !== client.user.id) return;

    // if its the bot reacting to its self, ignore it.
    if (message.author.id === user.id) return;

    // grab the current guild
    let guild = client.guilds.cache.get(message.guildId);

    // grab the current user
    let member = guild.members.cache.get(user.id);

    // get all the users roles and add them the the 'roles' array
    member.roles.cache.map(m => roles = [...roles, m.name.toLowerCase()]);
    if (message.embeds !== undefined) message.embeds.forEach(embed => {
        // grab the command refrence at the footer of every embed
        let commandRefrence = /\[(.+)\]/gm.exec(embed.footer.text)[1].split(','),
            command = global.commands[commandRefrence[0].toLowerCase()],
            reactionEmojie = reaction._emoji.name;

        // Check if the user containts the right premisions to react
        if (config.devid.includes(interaction.user.id) === false && checkPermisions(roles, [...command.reactionRoles, ...command.roles, ...global.adminRoles]) !== true) return;
        switch (removeReaction) {
            case false: // User added a reaction
                return command.reactionAddCallback(reactionEmojie, message, reaction, roles)
        }
    })
}