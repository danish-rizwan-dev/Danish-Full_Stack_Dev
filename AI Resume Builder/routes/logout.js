const express = require('express');
const Router = express.Router();

Router.get("/", function (req, res) {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = { logoutRouter: Router };