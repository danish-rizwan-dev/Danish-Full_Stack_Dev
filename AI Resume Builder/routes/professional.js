const express  = require("express");
const Router = express.Router();
const {executeQuery}  = require("../database/dbHelper");

// Professional Details
Router.get("/", async function (req, res) {
  const { isAuth,userId } = req;
  const resume_id = req.query.resume_id;
  if (!isAuth) return res.redirect("/login");
  try {
    const user = await executeQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    const result = await executeQuery(`select * from professionalExperience where resume_id = ?`,[resume_id]);
    console.log(result);
    res.render("professionalExperience", { isAuth, user, result });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Something went wrong" || error.message);
  }
});

Router.post("/", async function (req, res) {
    const { professionalExperience } = req.body;
  try {
    for (let i = 0; i < professionalExperience.length; i++) {
      const exp = professionalExperience[i];
    await executeQuery(`
      INSERT INTO professionalExperience(resume_id, position_title, company_name, city, state, start_date, end_date, summary )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          city = VALUES(city),
          state = VALUES(state),
          start_date = VALUES(start_date),
          end_date = VALUES(end_date),
          summary = VALUES(summary)
      `, [
        exp.resume_id,
        exp.position_title,
        exp.company_name,
        exp.city,
        exp.state,
        exp.start_date,
        exp.end_date,
        exp.summary
      ]);

    }
    res.send("Professional Experience added/updated successfully.");
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).send("Server error while saving professional experience.");
  }
});

module.exports = { professionalExperienceRouter: Router }; 