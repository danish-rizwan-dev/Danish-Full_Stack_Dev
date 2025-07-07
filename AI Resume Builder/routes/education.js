const express = require('express');
const { executeQuery } = require('../database/dbHelper');
const Router = express.Router();

// Education :
Router.get('/', async function (req, res) {
  const { isAuth, userId } = req;
  const resume_id = req.query.resume_id;
  if (!isAuth) return res.redirect('/login');
  try {
    const user = await executeQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    const education = await executeQuery('SELECT * FROM education WHERE resume_id = ?', [resume_id]);
    console.log("Education Data:", education);
    res.render('education', { isAuth, user, education });
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).send("Server error while fetching education details.");
  }
});

Router.post("/", async function (req, res) {
  const {educationDetails} = req.body;
  console.log(educationDetails);

  try {
    for(let i = 0; i < educationDetails.length; i++) {
      const edu = educationDetails[i];
      await executeQuery(`
        INSERT INTO education (
          institute_name, degree, state, start_date, end_date, description, resume_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          state = VALUES(state),
          start_date = VALUES(start_date),
          end_date = VALUES(end_date),
          description = VALUES(description)
      `, [
        edu.institute_name,
        edu.degree,
        edu.state,
        edu.start_date,
        edu.end_date,
        edu.description,
        edu.resume_id
      ]);

    }
    res.send("Education details added/updated successfully.");
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).send("Server error while saving education details.");
  }
});

module.exports = { educationRouter: Router };