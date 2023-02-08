import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import axios from "./axios";
import { auth } from "express-oauth2-jwt-bearer";
import { Server } from "socket.io";

dotenv.config();

const port = 4000;
const authMiddleware = auth({
  audience: process.env.AUTH0_IDENTIFIER,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASEURL,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", socket => {
  enum events {
    login = "login",
    logout = "logout",
  }

  socket.on(events.login, email => {
    socket.join(email);
  });

  socket.on(events.logout, email => {
    socket.broadcast.to(email).emit(events.logout);
  });
});

app.post("/meeting/create", authMiddleware, async (req, res, next) => {
  try {
    const response = await axios.post("/meetings", {
      title: req.body.title,
      preferred_region: "ap-south-1",
    });

    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

app.post("/meeting/join", authMiddleware, async (req, res, next) => {
  try {
    const params = req.body;
    const endpoint = `/meetings/${params.meetingId}/participants`;

    const response = await axios.post(endpoint, {
      name: params.name,
      custom_participant_id: params.custom_participant_id,
      preset_name: params.preset_name,
    });

    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message ?? "Unknown Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
