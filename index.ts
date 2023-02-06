import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "./axios";

import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();

const app = express();
const port = 4000;

const authMiddleware = auth({
  audience: process.env.AUTH0_IDENTIFIER,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL,
});

app.use(cors());

app.get("/", (req, res) => {
  res.send(`<p style="font-family: 'Segoe UI', sans-serif">Running...</p>`);
});

app.post("/meeting/create", authMiddleware, async (req, res) => {
  /**
   * Create dyte meeting here
   * and auto add user as host
   */
  try {
    const response = await axios.post("/meetings", {
      title: "First Meeting",
      preferred_region: "ap-south-1",
    });

    console.log(response.data, "response>>>>>");
    res.json(response.data);
  } catch (error) {
    console.log(error, 'error>>>>>');
  }
});

app.post("/meeting/join", authMiddleware, (req, res) => {
  /**
   * Join dyte meetings here as a
   * participant only
   */
});

app.get("/meetings", authMiddleware, (req, res) => {
  /**
   * Fetch all meetings the currently
   * authenticated user has joined and is
   * still ongoing.
   */
});

app.use((err: any, req: any, res: any, next: any) => {
  console.log(err, "caughted>>>>>");
  res.status(err.statusCode).json({
    error: err,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
