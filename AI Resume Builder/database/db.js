const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "Danish@123",
  database: "AI_Resume_builder",
});

connection.connect(function (err) {
  if (err) console.log(err);
});

module.exports = connection;
