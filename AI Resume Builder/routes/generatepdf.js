const express = require("express");
const { executeQuery } = require("../database/dbHelper");
const Router = express.Router();
const ejs = require("ejs");
const puppeteer = require("puppeteer");

Router.get("/", async function (req, res) {
  const { isAuth,userId} = req;
  if (!isAuth) return res.redirect("/login");
  const resume_id = req.query.resume_id;
  try {
    console.log("hello");
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

    const htmlString = await ejs.renderFile("./views/preview.ejs", {
      isAuth,
      user,
      userDetails,
      professionalExperience,
      education,
      skills,
    });
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlString);
    await page.pdf({
      path: "resume.pdf",
      format: "A4",
    });

    await browser.close();
    // res.send("File generated");
    res.download("resume.pdf");
  } catch (error) {
    console.log(error);
  }
});

module.exports = { generatePdfRouter: Router };
