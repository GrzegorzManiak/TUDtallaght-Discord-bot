const fetch = require('sync-fetch');

let timetableEndpoint = function(timetableCode) {
    return `https://timetables-ta.tudublin.ie/eportal/PortalServ?reqtype=timetable&action=getgrid&ttType=STUDENT&sKey=${global.config.academicYear}|${timetableCode}`;
}
let loginEndpoint = 'https://timetables-ta.tudublin.ie/eportal/PortalServ?reqtype=login';

function fetchTimetable(timetableCode) {
    let checkCache = global.cache.get(timetableCode);

    let loginCookie = fetch(loginEndpoint, {
        method: 'POST',
        body: { username: timetableCode }
    });

    let rawData = fetch(timetableEndpoint(timetableCode), {
        method: 'GET',
    }).text();

    let unprocesedTable = /<tbody>([.\s\S]+)<\/tbody>/gmi.exec(rawData);
    console.log(loginCookie.headers)
}
fetchTimetable('TA_KAITM_B_1b')