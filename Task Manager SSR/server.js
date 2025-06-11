const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const PORT = 8000;
const SECRET = "chickenbiryani";
const SALTROUNDS = 5;
let connection;

app.set("view engine", "ejs");

app.use(
  cors({
    origin: "*",
  })
);
app.use("/public", express.static("public"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function AuthMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
     req.isAuth = false;
     return next();
    }
    const payload = jwt.verify(token, SECRET);
    req.email = payload.email;
    req.isAuth = true;
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
}
app.use(AuthMiddleware);


app.listen(PORT, async function () {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "task_manager",
    });
    console.log(`Server started on Port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});

app.get("/", function (req, res, next) {
  const isAuth = req.isAuth;
  res.render("index", { flag : 3, isAuth });
});

app.get("/login", function (req, res, next) {
  const isAuth = req.isAuth;
   if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("login", { flag :1, isAuth });
});

app.get("/signup", function (req, res, next) {
  const isAuth = req.isAuth;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("signup", { flag:0, isAuth });
});

app.post("/signup", async function (req, res) {
  try {
    if (req.body.username && req.body.password) {
      const username = req.body.username;
      const first_name = req.body.first_name;
      const last_name = req.body.last_name;
      const email = req.body.email;
      const password = req.body.password;

      await connection.query(
        `INSERT INTO users(username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)`,
        [
          username,
          first_name,
          last_name,
          email,
          bcrypt.hashSync(password, SALTROUNDS),
        ]
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

app.post("/signin", async function (req, res) {
  try {
    console.log("signin");
    const  email= req.body.email;
    const  password  = req.body.password;

    if (email && password) {
      const result = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      const user = result[0][0];
      if (!user) {
        res.status(400).send({
      message: error.message || "Email/Password is invalid" ,
       });
      }
      if (await bcrypt.compare(password, user.password)) {
        res.cookie(
          "token",
          jwt.sign(
            {
              email: user.email,
            },
            SECRET
          )
        );
      } else {
          res.status(400).send({
      message: error.message || "Email/Password is invalid" ,
       });
      }
    } else {
       res.status(400).send({
      message: error.message || "Please provide necessary details." ,
    });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message || "Something went wrong",
    });
  }
});

app.get("/dashboard", async function (req, res, next) {
  const isAuth = req.isAuth;
  const email = req.email;
  if (!isAuth) {
    return res.redirect("/login");
  }
  const result = await connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  res.render("dashboard", { flag: 3, isAuth, tasks: result[0] });
});

app.get("/addtask", async function (req, res, next) {
  res.render("addtask", { flag: 3, isAuth: true });
});

app.post("/addtask", async function (req, res, next) {
  try {
        const title = req.body.title;
        const description = req.body.description;
        const imgLink = req.body.imgLink;
        const email = req.body.email;
    if (title && description && email) {
      await connection.query(
        `INSERT INTO tasks(title, description, imgLink, email) VALUES (?, ?, ?, ?)`,
        [title, description, imgLink, email]
      );
      res.send({ message: "Task Added Successfully" });
    } else {
      throw Error("Please provide necessary details.");
    }
  } catch (error) {
    console.log("error 1", error);
    res.status(400).send({
      message: error.message || "Something went wrong",
    });
  }
});

app.post("/logout", async function (req, res, next) {
  res.clearCookie('token', {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict'
});

  return res.redirect('/login');
});