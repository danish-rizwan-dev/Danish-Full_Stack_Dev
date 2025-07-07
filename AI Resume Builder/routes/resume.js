const express = require("express");
const Router = express.Router();
const { executeQuery } = require("../database/dbHelper");

Router.post("/", async function (req, res) {
  const { job_title } = req.body;
  const userId = req.userId;

  console.log("Job Title:", job_title, "User ID:", userId);
  try {
    const result = await executeQuery(
      `INSERT INTO resumes(job_title , user_id) VALUES(? , ?)`,
      [job_title, userId]
    );
    console.log("Resume ID:", result.insertId);
    res.status(200).send(result.insertId);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Something went wrong" || error.message);
  }
});

module.exports = { resumeRouter: Router };

