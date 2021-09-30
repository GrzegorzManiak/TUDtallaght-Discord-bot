const cors = require('cors');
const http = require('express')();
const discord = require('../discordBot');

//TODO// Needs rate Limiting //TODO//

http.use(cors({
    origin: '*',
    methods: ['POST']
}));

http.post('/', (req, res) => {
    res.sendStatus(200);
    res.end();
});

//--// Return a '400 bad request' if the page isint found or the wrong method is used
http.all('*', (req, res) => {
    res.sendStatus(400);
    res.end();
});

exports.app = http;