const express = require("express");
const Router = express.Router();
const { executeQuery } = require("../database/dbHelper");
const personal = require("./personal");

Router.get("/", async function (req, res) {
  const { isAuth,userId} = req;
  if (!isAuth) return res.redirect("/login");
  const resume_id = req.query.resume_id;
  try {
    const user = await executeQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    // Fetch personal details
    const [userDetails] = await executeQuery(
      `SELECT * FROM personalDetails WHERE resume_id = ?`,
      [resume_id]
    );

    // Fetch professional experience
    const professionalExperience = await executeQuery(
      `SELECT * FROM professionalExperience WHERE resume_id = ?`,
      [resume_id]
    );

    // Fetch education
    const education = await executeQuery(
      `SELECT * FROM education WHERE resume_id = ?`,
      [resume_id]
    );

    // Fetch skills (OPTIONAL: if skills are linked to resume_id)
    const skills = await executeQuery(
      `SELECT * FROM skills WHERE resume_id = ? `,
      [resume_id]
    );
    
    res.render("preview", {
      isAuth,
      user,
      userDetails,
      professionalExperience,
      education,
      skills,
      resume_id
    });
  } catch (error) {
    console.error("Preview error:", error.message);
    res.status(500).send("Server error while generating resume preview.");
  }
});



module.exports = { previewRouter: Router };
