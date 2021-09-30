const cors = require('cors');
const http = require('express')();
const discord = require('../discordBot');

//TODO// Needs rate Limiting //TODO//

http.use(cors({
    origin: '*',
    methods: ['POST']
}));

http.get('/', (req, res) => {
    let id = req.query.identifier;

    if (id === undefined || global.cache.get(id) === undefined) {
        res.send('bad2');
    } else {
        console.log(global.cache.get(id))
        res.send('good');
    }
    console.log(global.cache.get(id))
});

//--// Return a '400 bad request' if the page isint found or the wrong method is used
http.all('*', (req, res) => {
    res.sendStatus(400);
    res.end();
});

exports.app = http;