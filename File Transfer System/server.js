const express = require("express");
const app = express();
let mysql = require("mysql2/promise");
let bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
let jwt = require("jsonwebtoken");
let bodyparser = require("body-parser");
const cors = require("cors");

const SALTROUNDS = 5;
const SECRET = "BATMAN";
const PORT = 8000;

app.listen(PORT, function () {
  console.log("Server is working");
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: "*",
  }) 
);
app.use(cookieParser());
app.use(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5,
    },
    abortOnLimit: true,
    createParentPath: true,
  })
);

function authmiddleware(req,res,next){
   try {
    const token = req.cookies.token;
     if (!token) {
     req.isAuth = false;
     return next();
    }
    const payload = jwt.verify(token,SECRET);
    req.userId = payload.userId;
    req.isAuth = true;
    next();
   } catch (error) {
    req.isAuth = false;
    next();
   }
}
app.use(authmiddleware);

app.get("/home", async function (req, res) {
  const isAuth = req.isAuth;
  if (!isAuth) {
    return res.redirect("/login");
  }

  const connection = await mysql.createConnection({ 
    host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "FileTransferProject",
  });

  const data = await connection.query(
    `SELECT * FROM document WHERE user_id = ? ORDER BY uploaded_at DESC`,
    [req.userId]
  );
  const files = data[0];

  const data2 = await connection.query(
    `SELECT  u.email AS receiver_email, d.name AS document_name, s.shared_at FROM shares s
      JOIN document d ON s.document_id = d.id
      JOIN users u ON s.receiver_id = u.id
      WHERE s.sender_id =? `, [req.userId]);
  const sharedFiles = data2[0];
  
  const data3 = await connection.query(
    `SELECT 
    u.email AS sender_email,
    d.name AS document_name,
    s.shared_at
    FROM shares AS s
    JOIN document AS d ON s.document_id = d.id
    JOIN users AS u ON s.sender_id = u.id
    WHERE s.receiver_id = ?
    ORDER BY s.shared_at DESC`,
    [req.userId]
  );
  const recievedFiles = data3[0];
  res.render("home", { isAuth, files ,sharedFiles,recievedFiles});
  
});

app.get("/download", function (req, res) {
  let fileName = req.query.imageFile;
  res.download(__dirname + "/uploads/" + fileName);
});

app.get("/login",function(req,res){
    const isAuth = req.isAuth;
    if(isAuth) {
     return res.redirect("/home");
    }
    res.render("login",{isAuth});
})


app.get("/signup",function(req,res){
    const isAuth = req.isAuth;
    if(isAuth) {
     return res.redirect("/home");
    }
    res.render("signup",{isAuth});
})

app.post("/upload", async function (req, res) {
  try {
    const uploadFile = req.files.file;

    if (!uploadFile) {
      return res.status(400).send("No file uploaded");
    }
    uploadFile.mv(__dirname + "/uploads/" + uploadFile.name, async function (error) {
      if (error) {
        console.error("File move error:", error);
        return res.status(500).send("Failed to save file.");
      }

      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Danish@123",
        port: 3306,
        database: "FileTransferProject",
      });

      await connection.query(
        "INSERT INTO document (user_id, name) VALUES (?, ?)",
        [req.userId, uploadFile.name]
      );

      res.send("File uploaded successfully");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

app.post('/signup', async function(req,res){
  const {name , email , password } = req.body;
  try {
     const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "FileTransferProject",
    });
    
    const check = await connection.query(`SELECT * FROM users WHERE email = ?`, [email]);
    let user = check[0][0];
    
    if(user){
      return res.status(400).send({message : "Email already exists"});
    }else{
    const hasedpassword = await bcrypt.hashSync(password,SALTROUNDS);
    await connection.query(`INSERT INTO users(name, email, password) VALUES(?,?,?)`,[name,email,hasedpassword]);
    res.status(200).send("user Registerd Succesfully");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("server Error",error);
  }
});

app.post("/login",async function(req,res){
   const {email,password} = req.body;
   
   try {
    const connection =await mysql.createConnection({
      host : "localhost",
      user : "root",
      port : 3306,            
      password: "Danish@123",
      database: "FileTransferProject"
    })

    const check = await connection.query(`SELECT * FROM users WHERE email = ?`, [email]);
    let user  = check[0][0];
    if(user &&  bcrypt.compareSync(password,user.password)){
      res.cookie("token",jwt.sign({userId : user.id},SECRET));
        res.send("Added");
    }else {
      throw{
         message: "Invalid Email/Password"
      };
    }
   }catch(error) {
    res.status(400).send({
      message: error.message ? error.message : "Something went wrong",
    });
   }
});

app.post("/home/share", async function (req, res) {
  const { document_id, email } = req.body;
  console.log("heelow from share");

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "FileTransferProject"
    });

    const result = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    const receiver = result[0][0];
    if (!receiver) {
      return res.status(404).send("Receiver not found.");
    }
    const receiver_id = receiver.id;
      await connection.query(
      "INSERT INTO shares (document_id, sender_id, receiver_id) VALUES (?, ?, ?)",[document_id, req.userId, receiver_id] );

    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while sharing.");
  }
});

app.post("/delete", async function (req, res) {
  const { document_id } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 3306,
      password: "Danish@123",
      database: "FileTransferProject"
    });

    await connection.query("DELETE FROM shares WHERE document_id = ?", [document_id]);
    await connection.query("DELETE FROM document WHERE id = ?", [document_id]);

    res.send("File deleted successfully.");
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).send("Server error during deletion.");
  }
});


app.post("/logout", async function (req, res, next) {
res.clearCookie('token');
res.redirect("/login")
});

