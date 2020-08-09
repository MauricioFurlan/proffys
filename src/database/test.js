const Database = require('./db');
const createProffy = require('./createProffy')

Database.then(async (db) => {
    proffyValue = {
        name: "Mauricio Tomesani Furlan",
        avatar: "https://avatars1.githubusercontent.com/u/48259868?s=460&u=0b365465cbf4a0578dba4f0f08d372eacd4c07ac&v=4",
        whatsapp: "99999999",
        bio: "Programador que desenvolveu esta aplicação"
    }
    classValue = {
        subject: 1,
        cost: "free"
    }
    classScheduleValues = [
        {
        weekday: 1,
        time_from: 720,
        time_to: 1220
        },
        {
            weekday: 0,
            time_from: 520,
            time_to: 1220
        }
    ]
    // await createProffy(db, {proffyValue, classValue, classScheduleValues})

    const selectedProffys = await db.all("SELECT * FROM proffys")
    const selectClassesAndProffys = await db.all(`
        SELECT classes.*, proffys.* FROM proffys JOIN classes ON (classes.proffys_id = proffys.id)
        WHERE classes.proffys_id = 1;
    `)
    console.log(selectClassesAndProffys);
    const selectedClassSchedules = await db.all(`
            SELECT classe_schedule.* FROM classe_schedule
            WHERE classe_schedule.id = 1
            AND classe_schedule.weekday = 1
            AND classe_schedule.time_from <= 520
            AND classe_schedule.time_to > 520
    `)
    console.log(selectedClassSchedules);

})