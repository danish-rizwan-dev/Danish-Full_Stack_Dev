const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
let jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const cors = require("cors");

const SALTROUNDS = 6;
const SECRET = "DANYAI";
const PORT = 4000;
app.use(cookieParser());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: "*",
  })
);

function authmiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      req.isAuth = false;
      return next();
    }
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    req.isAuth = true;
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
}
app.use(authmiddleware);

app.listen(PORT, function () {
  console.log("AI Resume Builder Server Started : " + PORT);
});

app.get("/", function (req, res) {
  const isAuth = req.isAuth;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("login", { isAuth });
});

app.get("/login", function (req, res) {
  const isAuth = req.isAuth;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("login", { isAuth });
});

app.get("/signup", function (req, res) {
  const isAuth = req.isAuth;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("signup", { isAuth });
});

app.get("/dashboard", async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "Danish@123",
    database: "AI_Resume_builder",
  });

  const data = await connection.query(`SELECT * FROM users WHERE id = ?`, [
    req.userId,
  ]);
  let user = data[0];

  res.render("dashboard", { isAuth, user });
});

app.post("/signup", async function (req, res) {
  const { name, email, password } = req.body;
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });

    const check = await connection.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    let user = check[0][0];

    if (user) {
      return res.status(400).send({ message: "Email already exists" });
    } else {
      const hasedpassword = await bcrypt.hashSync(password, SALTROUNDS);
      await connection.query(
        `INSERT INTO users(name, email, password) VALUES(?,?,?)`,
        [name, email, hasedpassword]
      );
      res.status(200).send("user Registerd Succesfully");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("server Error", error);
  }
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });

    const check = await connection.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    let user = check[0][0];
    if (user && bcrypt.compareSync(password, user.password)) {
      res.cookie("token", jwt.sign({ userId: user.id }, SECRET));
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

app.get("/logout", function (req, res) {
  res.clearCookie("token");
  res.redirect("/login");
});

// Resume Details :-

// Peronal Details
app.get("/personal",async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  res.render("PersonalDetails", { isAuth, user: "Home" });
}); 

app.post("/personalDetails", async function (req, res) {
  const { name, job_title, address, phone, email } = req.body;
   let uniqueResumeID = Math.random()*1000;
   try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });

    await connection.query(
      `INSERT INTO personalDetails(name, job_title, address,phone,email) VALUES(?,?,?,?,?)`,
      [name,job_title,address,phone,email]
    );
    res.status(200).send("Personal Details Added Succesfully");

  } catch (error) {
    console.log(error);
    res.status(400).send("server Error", error);
  }
});

// Professional Experience
app.get("/ProfessionalExperience",async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  res.render("ProfessionalExperience", { isAuth, user: "Home" });
});

// Education : 

app.get("/education",async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  res.render("education", { isAuth, user: "Home" });
});

