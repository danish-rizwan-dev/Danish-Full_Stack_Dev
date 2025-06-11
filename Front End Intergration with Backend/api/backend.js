const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.listen(3000, function () {
  console.log("Server Started");
});

const names = [
  "Danish", "Furqan", "Usman", "Hussain", "Gufran",
  "Ali Bhai", "Sammer", "Royal"
];

app.get("/random-name", function (req, res) {
  res.send(names[Math.floor(Math.random() * 8)]); 
});