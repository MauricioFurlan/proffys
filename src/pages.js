const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format')
const Database = require('./database/db')


function pageLanding(req, res) {
    return res.render("index.html")
  }
  
  async function pageStudy(req, res) {
    const filters = req.query

    if (!filters.subject || !filters.weekday || !filters.time) {
    return res.render("study.html", {filters, subjects, weekdays})
    }

    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
    SELECT classes.*, proffys.*
    FROM proffys JOIN classes ON (classes.proffys_id = proffys.id)
    WHERE EXISTS(
        SELECT classe_schedule.* FROM classe_schedule
        WHERE classe_schedule.id = classes.id
        AND classe_schedule.weekday = ${filters.weekday}
        AND classe_schedule.time_from <= ${timeToMinutes}
        AND classe_schedule.time_to > ${timeToMinutes}
    )
        AND classes.subject = ${filters.subject}
    `
    try {
     const db = await Database;
     const proffys = await db.all(query);
     console.log("opa",proffys)
     proffys.map((proffy) => {
         proffy.subject = getSubject(proffy.subject);
     })
    return res.render("study.html", {proffys, filters, subjects, weekdays})

    } catch (error) {
        console.log(error)
    }
  }
  
  function pageGiveClasses(req, res) {

    return res.render("give-classes.html", {subjects, weekdays})
  }

  async function saveClasses(req, res){
      const createProffy = require('./database/createProffy')
      const proffyValue = {
          name: req.body.name,
          avatar: req.body.avatar,
          whatsapp: req.body.whatsapp,
          bio: req.body.bio
      }
      const classValue = {
          subject: req.body.subject,
          cost: req.body.cost
      }
      const classScheduleValues = req.body.weekday.map((weekday, index) => {
          return {
              weekday,
              time_from: convertHoursToMinutes(req.body.time_from[index]),
              time_to: convertHoursToMinutes(req.body.time_to[index])
          }
      })
      try {
          const db = await Database;
          await createProffy(db, { proffyValue, classValue, classScheduleValues })
          let queryString = "?subject=" + req.body.subject
          queryString += "&weekday=" + req.body.weekday[0]
          queryString += "&time=" + req.body.time_from
          console.log(queryString)
          return res.redirect("/study" + queryString)
      } catch (error) {
          console.log(error);
      }


  }
  
  module.exports = {pageLanding, pageStudy, pageGiveClasses, saveClasses}