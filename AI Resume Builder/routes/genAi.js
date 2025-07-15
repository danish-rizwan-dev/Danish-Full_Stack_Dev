const express = require("express");
const Router = express.Router();
const { executeQuery } = require("../database/dbHelper");
const { GoogleGenAI } = require("@google/genai");

Router.post("/experience", async function (req, res) {
  try {
    const {
      position_title,
      company_name,
      city,
      start_date,
      end_date,
      summary,
    } = req.body;
    if (!req.isAuth) return res.redirect("/login");

    const prompt = `
            You are a professional resume writer.
            Below is a user's raw resume data, including job title, company, location, dates, and a job description summary.
            Your task is to generate a concise resume summary in just 3–4 lines.

            🟢 Guidelines:
            - Write only one paragraph, 3–4 lines maximum.
            - Make it tight, impactful, and professional.
            - Focus on core strengths, roles, or achievements.
            - Do NOT add bullet points, headings, or extra info.
            - Use only the data provided — do not invent.

            📄 Resume Data:
            position_title: ${position_title}
            company_name: ${company_name}
            city: ${city}
            start_date: ${start_date}
            end_date: ${end_date}
            summary: ${summary}
    `;
    const genAI = new GoogleGenAI({
      apiKey: "#",
    });
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);
    return res.status(200).send({ message: response.text });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

Router.post("/education", async function (req, res) {
  try {
    const {
      institute_name,
      degree,
      state,
      start_date,
      end_date,
      description,
    } = req.body;
    if (!req.isAuth) return res.redirect("/login");

    const prompt = `
          You are a professional resume writer.
          Below is a user's education history. Your task is to write a *concise, polished summary of this educational experience* in just 3–4 lines.

          🟢 Guidelines:
          - Write only one short paragraph (3–4 lines).
          - Be professional and highlight academic strength or achievements.
          - Do not use headings, bullet points, or any invented info.
          - Keep the tone formal and resume-ready.

          📄 Education Data:
          Institute: ${institute_name}
          Degree: ${degree}
          State: ${state}
          Start Date: ${start_date}
          End Date: ${end_date}
          Description: ${description}
    `;
    const genAI = new GoogleGenAI({
      apiKey: "#",
    });
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);
    return res.status(200).send({ message: response.text });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = { genAiRouter: Router };
