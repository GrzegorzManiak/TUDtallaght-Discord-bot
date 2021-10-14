const bot = require('../source')
let classes = require('../source/classes');
let config = bot.getConfig();

bot.client.on('messageCreate', async(message) => {
    let userManger = new classes.user(message?.user?.id || message?.author?.id, message.channel.type === 'DM' ? config.serverid : message.guild.id, bot.client),
        user = await userManger.getUser();

    if(user?.id === bot?.client?.id) return;

    retard(message, user);
});

async function retard(message, user){
    //5% chance of replying
    if (Math.random() < 0.05) {
        let arr = [
            'Shut up retard 😐',
            'Is a twat',
            'Stfu 😞',
            'Has profound mental retardation',
            'Big balls, small dick or Small balls, big dick?',
            '**Shitpost** (noun) any content on the internet whose humor derives from its surreal nature and/or its lack of clear context. Differs from a meme: whereas a meme\'s humor comes from its repeatability, a shitpost is funny simply because it isn\'t a predictable repetition of an existing form. Shitposts can become memes, but memes cannot become shitposts.'
        ],
            msg = Math.floor(Math.random() * 4);

        message.channel.send({ 
            content:`<@${user.id}> ${arr[msg]}.`, 
            fetchReply: true
        });
    }
}