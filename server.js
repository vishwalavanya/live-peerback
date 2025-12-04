import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------
// 🔐 ENV VARIABLES (set in Render)
// ----------------------------------
const LIVEPEER_API_KEY = process.env.LIVEPEER_API_KEY;
const STREAM_ID = process.env.LIVEPEER_STREAM_ID;   // ammu-live stream ID
const PLAYBACK_ID = process.env.LIVEPEER_PLAYBACK_ID;

// ----------------------------------
// LIVEPEER API BASE
// ----------------------------------
const LIVEPEER_API = axios.create({
  baseURL: "https://livepeer.studio/api",
  headers: {
    Authorization: `Bearer ${LIVEPEER_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// ----------------------------------
// ▶️ START STREAM (activate camera)
// ----------------------------------
app.post("/start-stream", async (req, res) => {
  try {
    const { data } = await LIVEPEER_API.post(`/stream/${STREAM_ID}/activate`);
    return res.json({ success: true, message: "Stream activated", data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------
// ⏹ STOP STREAM
// ----------------------------------
app.post("/stop-stream", async (req, res) => {
  try {
    const { data } = await LIVEPEER_API.post(`/stream/${STREAM_ID}/deactivate`);
    return res.json({ success: true, message: "Stream stopped", data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------
// 📡 STREAM STATUS
// ----------------------------------
app.get("/status", async (req, res) => {
  try {
    const { data } = await LIVEPEER_API.get(`/stream/${STREAM_ID}`);
    return res.json({ success: true, status: data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------
// 🎥 PLAYBACK URL (permanent)
// ----------------------------------
app.get("/playback-url", (req, res) => {
  return res.json({
    url: `https://livepeercdn.studio/hls/${PLAYBACK_ID}/index.m3u8`,
  });
});

// ----------------------------------
app.get("/", (req, res) => {
  res.send("Livepeer backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
