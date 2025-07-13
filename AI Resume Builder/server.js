const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const cors = require("cors");
const { Auth } = require("./middleware");
const constants = require("./constant");

const { signupRouter } = require("./routes/signup");
const { loginRouter } = require("./routes/login");  
const { logoutRouter } = require("./routes/logout");
const { dashboardRouter } = require("./routes/dashboard");
const { previewRouter } = require("./routes/preview");
const { educationRouter } = require("./routes/education");
const { professionalExperienceRouter } = require("./routes/professional");
const { personalDetailsRouter } = require("./routes/personal");
const { skillsRouter } = require("./routes/skills");
const { resumeRouter } = require("./routes/resume");
const { homeRouter } = require("./routes/home");
const { generatePdfRouter } = require("./routes/generatepdf");

app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(cors({ origin: "*", }
));
app.use(Auth);

app.use("/", homeRouter);
app.use("/skills", skillsRouter);
app.use("/resume", resumeRouter);
app.use("/personalDetails", personalDetailsRouter);
app.use("/education", educationRouter);
app.use("/professionalExperience", professionalExperienceRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/dashboard", dashboardRouter);
app.use("/preview", previewRouter);
app.use("/generatePdf", generatePdfRouter);

app.listen(constants.PORT, function() {
  console.log("AI Resume Builder Server Started : " + constants.PORT);
});
