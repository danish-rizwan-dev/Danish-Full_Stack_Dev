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

    const [userDetails] = await executeQuery(
      `SELECT * FROM personalDetails WHERE resume_id = ?`,
      [resume_id]
    );

    const professionalExperience = await executeQuery(
      `SELECT * FROM professionalExperience WHERE resume_id = ?`,
      [resume_id]
    );

    const education = await executeQuery(
      `SELECT * FROM education WHERE resume_id = ?`,
      [resume_id]
    );

    const skills = await executeQuery(
      `SELECT * FROM skills WHERE resume_id = ? `,
      [resume_id]
    );

    const htmlString = await ejs.renderFile("./views/downloadPdf.ejs", {      
      userDetails,
      professionalExperience,
      education,
      skills,
      resume_id
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlString);
    await page.pdf({
      path: `./resumes/${userDetails.name}-resume.pdf`,
      format: 'A4'
    });

    await browser.close();
    res.download(`./resumes/${userDetails.name}-resume.pdf`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = { generatePdfRouter: Router };
