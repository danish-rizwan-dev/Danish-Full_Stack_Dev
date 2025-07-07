const express = require("express");
const { executeQuery } = require("../database/dbHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../constant");
const Router = express.Router();

Router.get("/", function (req, res) {
  const { isAuth } = req;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("login", { isAuth, user: false });
});

Router.post("/", async function (req, res) {
  const { email, password} = req.body;
  try {
    const [user] = await executeQuery(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    if (user && await bcrypt.compareSync(password, user.password)) {
      res.cookie("token", jwt.sign({ userId: user.id }, constants.SECRET));
      res.send("Added");
    } else {
      throw {
        message: "Invalid Email/Password",
      };
    }
  } catch (error) {
    res.status(400).send({
      message: error.message ? error.message : "Something went wrong",
    });
  }
});

module.exports = { loginRouter: Router };
