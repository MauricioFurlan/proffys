module.exports = async function(db, {proffyValue, classValue, classScheduleValues}){
    const insertedProffy = await db.run(`
        INSERT INTO proffys (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (
            "${proffyValue.name}",
            "${proffyValue.avatar}",
            "${proffyValue.whatsapp}",
            "${proffyValue.bio}"
        );
    `)
    const proffys_id = insertedProffy.lastID

    const insertedClass = await db.run(`
    INSERT INTO classes (
        subject,
        cost,
        proffys_id
    ) VALUES (
        "${classValue.subject}",
        "${classValue.cost}",
        "${proffys_id}"
    );
`)
    const class_id = insertedClass.lastID
    const insertedAllScheduleValues = classScheduleValues.map((classScheduleValue) =>{ 
        return db.run(`
        INSERT INTO classe_schedule (
            class_id,
            weekday,
            time_from,
            time_to
        ) VALUES (
            "${class_id}",
            "${classScheduleValue.weekday}",
            "${classScheduleValue.time_from}",
            "${classScheduleValue.time_to}"
        );
        `)
    })
    await Promise.all(insertedAllScheduleValues)
}