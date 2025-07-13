const express = require("express");
const { excuteQuery } = require("../database/dbHelper");
const Router = express.Router();
const html2pdf = require("html-pdf-node");
const ejs = require("ejs");
const { writeFileSync } = require("fs");
const puppeteer = require("puppeteer");

// dashboard
Router.get("/", async function (req, res) {
  const { isAuth, userId } = req;
  if (!isAuth) return res.redirect("/login");
  const user = await excuteQuery(`SELECT * FROM users WHERE id = ?`, [userId]);
  const resume = await excuteQuery(`SELECT * FROM resumes where user_id  = ?`, [
    userId,
  ]);
  res.render("dashboard", { isAuth, user, resume });
});

// Router.get("/generatePDF", async function (req, res) {
//   try {
//     const htmlString = await ejs.renderFile("./views/invoice.ejs", {
//       name: "Danish",
//     });

//     // Launch the browser and open a new blank page
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setContent(htmlString);
//     await page.pdf({
//       path: "invoice.pdf",
//       format: "A4",
//     });

//     await browser.close();
//     // res.send("File generated");
//     res.download("invoice.pdf");
//   } catch (error) {
//     console.log(error);
//   }
//   /* 
// ejs.renderFile(
//     "./views/invoice.ejs",
//     { name: "usmaan" },
//     function (err, html) {
//       if (err) console.log(err);
//       html2pdf.generatePdf(
//         {
//           content: html,
//         },
//         {},
//         function (err, data) {
//           if (err) console.log(err);
//           writeFileSync("invoice.pdf", data);
//           res.send(html);
//         }
//       );
//     }
//   );

//   */
// });

module.exports = { homeRouter: Router };
