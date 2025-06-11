const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jasonwebtoken");
const bcrypt = require("bcyrpt");

const PORT = 3000;
app.use(
  cors({
    origin :"*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, async function (){
  connection = console.log(`Server Started on Port : ${PORT}`);
});

app.post("/signin", async function (req, res) {
  try {
    if (req.body.username && req.body.password) {
      const username = req.body.username;
      const password = req.body.password;
      const result = await connection.query(
        "select * from users where username =?",
        [username]
      );
      const user = result[0][0];
      if (user && bcrypt.compareSync(password, user.password)) {
        res.send({
          message: "Login Successfull",
          token: `Bearer ${jwt.sign(
            {
              username: user.username,
              id: user.id,
            },
            SECRET
          )}`,
        });
      } else {
        throw {
          message: "User/Password is invalid",
        };
      }
    } else {
      throw {
        message: "Please provide neccessary details.",
      };
    }
  } catch (error) {
    res.status(400).send({
      message: error.message ? error.message : "Something went wrong",
    });
  }
});

app.post("/signup", async function (req, res) {
  try {
    if (req.body.username && req.body.password) {
      const username = req.body.username;
      const password = req.body.password;
      await connection.query(
        "insert into users(username, password) values(?,?)",
        [username, bcrypt.hashSync(password, SALTROUNDS)]
      );
      res.send({
        message: "Signup Successfull",
      });
    } else {
      throw {
        message: "Please provide neccessary details.",
      };
    }
  } catch (error) {
    res.status(400).send({
      message: error.message ? error.message : "Something went wrong",
    });
  }
});