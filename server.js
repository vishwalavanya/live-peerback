import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.LIVEPEER_API_KEY;
const STREAM_ID = process.env.LIVEPEER_STREAM_ID;

// STEP 1 → Create WebRTC broadcast session
app.get("/start-webrtc", async (req, res) => {
  try {
    const response = await fetch("https://livepeer.studio/api/webrtc/broadcast", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        streamId: STREAM_ID,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// STEP 2 → Send the browser's SDP offer to Livepeer
app.post("/broadcast-sdp", async (req, res) => {
  try {
    const { sdpUrl, offerSdp } = req.body;

    const r = await fetch(sdpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/sdp",
      },
      body: offerSdp,
    });

    const answerSdp = await r.text();
    res.json({ answerSdp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Livepeer WebRTC backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));

