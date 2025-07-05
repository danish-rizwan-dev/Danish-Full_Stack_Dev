const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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
  res.render("login", { isAuth, user : false  });
});

app.get("/login", function (req, res) {
  const isAuth = req.isAuth;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("login",{ isAuth, user : false  });
});

app.get("/signup", function (req, res) {
  const isAuth = req.isAuth;
  if (isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("signup",{ isAuth, user : false  });
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

// dashboard
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

  const data1 = await connection.query(`SELECT * FROM resumes where user_id  = ?` , [req.userId]);
  const resume = data1[0];

  res.render("dashboard", { isAuth, user, resume });
});

// Resume Details :-
app.post("/resume", async function (req, res) {
  const job_title = req.body.job_title.trim();

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });
    const result = await connection.query(
      `INSERT INTO resumes(job_title , user_id) VALUES(? , ?)`,
      [job_title , req.userId]
    );
    console.log("Resume ID:", result[0].insertId);
    res.status(200).send(result[0].insertId);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Something went wrong" || error.message);
  }
});

// Peronal Details
app.get("/personal", async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });
  
    const [result] = await connection.query(
    `select * from personalDetails where resume_id = ?`,[req.query.resume_id]);
     console.log(result);
    res.render("PersonalDetails", { isAuth, user: "Home" , result });

  } catch (error) {
    console.log(error.message);
    res.status(400).send("Something went wrong" || error.message);
  }
});

app.post("/personalDetails", async function (req, res) {
  const { resume_id, name, job_title, address, phone, email } = req.body;
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });
    
    await connection.query(
    `INSERT INTO personalDetails (resume_id, name, job_title, address, phone, email)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      name = VALUES(name),
      job_title = VALUES(job_title),
      address = VALUES(address),
      phone = VALUES(phone),
      email = VALUES(email);`,  
    [resume_id, name, job_title, address, phone, email]);
    res.status(200).send("Personal Details Added Succesfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("server Error", error);
  }
});

// Professional Experience
app.get("/ProfessionalExperience", async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  res.render("ProfessionalExperience", { isAuth, user:"1" });
});

app.post("/professionalExperience", async function (req, res) {
  const professionalExperience = req.body.professionalExperience;
  console.log(professionalExperience);

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });

    for (let i = 0; i < professionalExperience.length; i++) {
      const exp = professionalExperience[i];

      await connection.query(`
        INSERT INTO professionalExperience (
          position_title, company_name, city, state, start_date, end_date, summary, resume_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        exp.position_title,
        exp.company_name,
        exp.city,
        exp.state,
        exp.start_date,
        exp.end_date,
        exp.summary,
        exp.resume_id
      ]);
    }

    res.send("Professional Experience added/updated successfully.");
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).send("Server error while saving professional experience.");
  }
});

// Education :
app.get("/education", async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  res.render("education", { isAuth, user: "Home" });
});

app.post("/education", async function (req, res) {
  const educationDetails = req.body.educationDetails;
  console.log(educationDetails);

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });

    for (let i = 0; i < educationDetails.length; i++) {
      const edu = educationDetails[i];

      await connection.query(`
        INSERT INTO education (
          institute_name, degree, state, start_date, end_date, description, resume_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        edu.institute_name,
        edu.degree,
        edu.state,
        edu.start_date,
        edu.end_date,
        edu.description,
        edu.resume_id
      ]);
    }

    res.send("Education details added/updated successfully.");
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).send("Server error while saving education details.");
  }
});


// skills :
app.get("/skills", async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  res.render("skills", { isAuth, user: "Home" });
});

app.post("/skills", async function (req, res) {
  const skills = req.body.skills;
  console.log(skills);

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "AI_Resume_builder",
    });

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];

      await connection.query(`
        INSERT INTO skills (
          name, resume_id, description
        )
        VALUES (?,?,?)
      `, [
        skill.name,
        skill.resume_id,
        skill.description,
      ]);
    }

    res.send("Skills saved successfully.");
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Server error while saving skills.");
  }
});



app.get("/preview", async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }
  const resume_id = req.query.resume_id;
  if (!resume_id) {
    return res.status(400).send("Missing resume_id");
  }

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Danish@123",
      port: 3306,
      database: "AI_Resume_builder",
    });

    // Fetch personal details
    const [personalRows] = await connection.query(
      `SELECT * FROM personalDetails WHERE resume_id = ?`,
      [resume_id]
    );
    const userDetails = personalRows[0] || {};

    // Fetch professional experience
    const [experienceRows] = await connection.query(
      `SELECT * FROM professionalExperience WHERE resume_id = ? ORDER BY start_date DESC`,
      [resume_id]
    );

    // Fetch education
    const [educationRows] = await connection.query(
      `SELECT * FROM education WHERE resume_id = ? ORDER BY start_date DESC`,
      [resume_id]
    );

    // Fetch skills (OPTIONAL: if skills are linked to resume_id)
    const [skillsRows] = await connection.query(
      `SELECT * FROM skills`
    );

    res.render("preview", {
      isAuth,
      user : "Danish",
      userDetails,
      professionalExperience: experienceRows,
      education: educationRows,
      skills: skillsRows,
    });

  } catch (error) {
    console.error("Preview error:", error.message);
    res.status(500).send("Server error while generating resume preview.");
  }
});
