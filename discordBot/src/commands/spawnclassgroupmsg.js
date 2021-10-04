const bot = require('../index.js')
let config = bot.getConfig();

let interactables = (guild) => {
    return new bot.discordjs.MessageActionRow()
        .addComponents(
            new bot.discordjs.MessageSelectMenu()
            .setCustomId(`button,spawnauthmsg,verify,${guild}`)
            .addOptions([{label:'test', value:'test'}])
        );
}

let embed = () => {
    return {
        color: 0x0099ff,
        title: 'Select your class group from the dropdown below.',
        description: 'By selecting your class group youll get access to the timetable related commands.',
        url: 'https://github.com/KetamineKyle/TUDtallaght-Discord-bot',
        fields: [],
        footer: {
            text: 'Made by Grzegorz M | [spawnclassgroupmsg]',
            icon_url: 'https://cdn.discordapp.com/avatars/892820433592803400/61cdf5225f23d50315ada918b4c4efc8.webp?size=80',
        },
    }
}

exports.command = {
    commandName: 'SpawnClassGroupMsg',
    callbackFunction: function(parameters, message, roles) {
        message.reply({embeds:[embed()], components: [interactables(message.guildId)]})
    },
    canExecInDm: false,
    useSlashCommands: true,
    description: 'This command spawns in the class group selector.',
    roles: {
        user: global.userRoles,
        buttonRoles: global.userRoles
    },
    slashParams:[
        ['number', 'channel', 'The id of the cannel you want the message to be sent to', false]
    ]
}