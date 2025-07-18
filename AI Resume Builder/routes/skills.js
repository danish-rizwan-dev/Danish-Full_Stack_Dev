const express = require('express');
const Router = express.Router();
const { executeQuery } = require('../database/dbHelper');

Router.get('/', async function (req, res) {
  const { isAuth, userId } = req;
  const resume_id = req.query.resume_id;
  if (!isAuth) return res.redirect('/login');

  try {
    const user = await executeQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    const result = await executeQuery(`SELECT * FROM skills WHERE resume_id = ?`, [resume_id]);
    res.render('skills', { isAuth, user, result });
  } catch (error) {
    console.log(error.message);
    res.status(400).send('Something went wrong' || error.message);
  }
});

Router.post("/", async function (req, res) {
  const {skills} = req.body;
  try {
    await executeQuery(`DELETE FROM skills WHERE resume_id = ? `, [skills[0].resume_id]);
    for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    await executeQuery(`
      INSERT INTO skills (
        name, resume_id, description
      )
      VALUES (?, ?, ?)
    `, [
      skill.name,
      skill.resume_id,
      skill.description
    ]);
    }
    res.send("Skills saved successfully.");
  } catch (error) {
    console.log("Database Error:", error);
    res.status(500).send("Server error while saving skills.");
  }
});

module.exports = { skillsRouter: Router };