const express = require("express");
const Router = express.Router();
const { executeQuery } = require("../database/dbHelper");

// Peronal Details
Router.get("/", async function (req, res) {
  const { isAuth, userId } = req;
  const resume_id = req.query.resume_id;
  if (!isAuth) return res.redirect("/login");
  try{
    const user = await executeQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
    const [result] = await executeQuery(`select * from personalDetails where resume_id = ?`,[resume_id]);
    console.log(result);
    res.render("PersonalDetails", { isAuth, user, result });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Something went wrong" || error.message);
  }
});

Router.post("/", async function (req, res) {
  const { resume_id, name, job_title, address, phone, email } = req.body;
  try {
    await executeQuery(
      `INSERT INTO personalDetails (resume_id, name, job_title, address, phone, email)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      name = VALUES(name),
      job_title = VALUES(job_title),
      address = VALUES(address),
      phone = VALUES(phone),
      email = VALUES(email);`,
      [resume_id, name, job_title, address, phone, email]
    );
    res.status(200).send("Personal Details Added Succesfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("server Error", error);
  }
});

module.exports = { personalDetailsRouter: Router };
