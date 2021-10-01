const fetch = require('sync-fetch');
const htmlParser = require('node-html-parser');

let timetableEndpoint = function(timetableCode) {
    return `https://timetables-ta.tudublin.ie/eportal/PortalServ?reqtype=timetable&action=getgrid&ttType=STUDENT&sKey=${global.config.academicYear}|${timetableCode}`;
}
let loginEndpoint = 'https://timetables-ta.tudublin.ie/eportal/PortalServ?reqtype=login';
let regex = /<table width="100%" class="gridTable" summary="Timetable Grid View" >([.\s\S]+)<\/table>/gmi;

exports.fetchTimetable = function fetchTimetable(timetableCode) {
    // Checks if a version already exists in the cache
    let checkCache = global.cache.get(timetableCode.toLowerCase());
    if (checkCache !== undefined) return checkCache;

    let loginCookie = fetch(loginEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': ' application/x-www-form-urlencoded'
        },
        body: `appname=unknown&appversion=unknown&ostype=mozilla%2F5.0+%28windows+nt+10.0%3B+win64%3B+x64%29+applewebkit%2F537.36+%28khtml%2C+like+gecko%29+chrome%2F94.0.4606.61+safari%2F537.36+edg%2F94.0.992.31&type=null&ssobypass=true&dirlogin=true&inch=true&scrWidth=2560&scrHeight=1080&username=${timetableCode}&userpassword=`
    }).headers.get('set-cookie').replace(/(;.+)/, '');

    let rawData = fetch(timetableEndpoint(timetableCode), {
        method: 'GET',
        headers: { 'Cookie': loginCookie },
    }).text();

    // Make sure that the time table data exists.
    let tableData = regex.exec(rawData);
    if (tableData === null) return { error: 'Timetable not found /or/ JWT Invalid' };

    // parseing the html to make it easier to work with
    let unprocesedTable = htmlParser.parse(tableData[1].replace(/\n/g, '')); // Remove all other Html data

    let tableStructure = {
        1: 'event_id',
        2: 'day',
        3: 'start',
        4: 'finish',
        5: 'room',
        7: 'subject_code',
        8: 'subject_name'
    }

    let procesedTable = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: []
    };

    // Process the time table
    unprocesedTable.childNodes.forEach(child => {
        let id = 0,
            procesedEntry = {};

        child.childNodes.forEach(innerChild => {
            // grab the elements text
            let rawText = innerChild.childNodes[0]._rawText;

            if (tableStructure[id] !== undefined && innerChild.rawAttrs.toLowerCase() === 'class="griddata"') {
                // Change the day to lowercase, as this will be used for indexing
                if (id === 2) procesedEntry.day = rawText.toLowerCase();

                // Otherwise just add it to the object and asign it a key coresponing with the 'tableStructure'
                else procesedEntry[tableStructure[id]] = rawText
            }

            id++;
        });

        if (procesedEntry.day !== undefined) procesedTable[procesedEntry.day] += procesedEntry
    });

    // Make sure that we cache the request for 24h so that we dont constantly ping the endpoint
    global.cache.set(timetableCode.toLowerCase(), procesedTable, 86400); //24 Hours TTl
    return procesedTable;
}