const express = require("express");
const { executeQuery } = require("../database/dbHelper");
const bcrypt = require("bcrypt");
const constants = require("../constant");
const Router = express.Router();

Router.get("/", function (req, res) {
  const { isAuth } = req;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("signup", { isAuth, user: false });
});

Router.post("/", async function (req, res) {
  const { email, password, name } = req.body;
  try {
    const [user] = await executeQuery(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    if (user) {
      return res.status(400).json({ message: "User already exists " });
    } else {
      const hashedPassword = bcrypt.hashSync(password, constants.SALTROUNDS);
      await executeQuery(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword]
      );
      res.send({ message: "User created successfully" });
    }
  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

module.exports = { signupRouter: Router };
