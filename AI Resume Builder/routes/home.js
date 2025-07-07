const express = require("express");
const { excuteQuery } = require("../database/dbHelper");
const Router = express.Router();

// dashboard
Router.get("/", async function (req, res) {
  const { isAuth, userId } = req;
  if (!isAuth) return res.redirect("/login");
  const user = await excuteQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
  const resume = await excuteQuery(`SELECT * FROM resumes where user_id  = ?`, [userId,]);
  res.render("dashboard", { isAuth, user, resume });
});

module.exports = { homeRouter : Router}