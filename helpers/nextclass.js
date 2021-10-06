const timetableHelper = require('./timetable.js')

exports.nextClass = (timetable) => {
    let today = new Date().getDay();
    console.log(timetableHelper.getDay(timetable, today))
}
