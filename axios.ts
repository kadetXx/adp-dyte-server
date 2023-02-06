import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const keys = `${process.env.DYTE_ORG_ID}:${process.env.DYTE_API_KEY}`;
const access = Buffer.from(keys).toString("base64");

const instance = axios.create({
  baseURL: process.env.DYTE_BASE_URL,
  timeout: 10000,
  headers: { Authorization: `Basic ${access}` },
});

export default instance;
