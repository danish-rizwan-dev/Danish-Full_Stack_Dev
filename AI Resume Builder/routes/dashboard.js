const express = require("express");
const { executeQuery } = require("../database/dbHelper");
const Router = express.Router();

// dashboard
Router.get("/", async function (req, res) {
  const { isAuth, userId } = req;
  if (!isAuth) return res.redirect("/login");
  const user = await executeQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
  const resume = await executeQuery(`SELECT * FROM resumes where user_id  = ?`, [userId]);
  res.render("dashboard", { isAuth, user, resume });
});

Router.delete("/deleteResume", async function (req, res) {
  const { isAuth, userId } = req;
  if(!isAuth) return res.redirect("/login");
  const resume_id = req.query.resume_id;
  try {
    await executeQuery(`DELETE FROM resumes WHERE id = ? AND user_id = ?`, [resume_id, userId]);
    res.status(200).send("Resume deleted successfully...");
  } catch (error) {
    res.status(500).send("Server error while deleting resume.");
  }
});

module.exports = { dashboardRouter : Router}