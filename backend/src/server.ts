import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

// ─── Express & Socket.io Setup ───────────────────────────────────────────────
// Express ist unser HTTP Server
// Socket.io läuft darauf und ermöglicht Echtzeit-Kommunikation mit dem Frontend
const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server (React) läuft hier
    methods: ["GET", "POST"],
  },
});

// ─── Verbindung zum Python Simulator ─────────────────────────────────────────
// Wir sind hier der CLIENT der sich zum Python WebSocket Server verbindet
let simulatorWs: WebSocket | null = null;
let latestData: object = {};

function connectToSimulator() {
  console.log("Connecting to Python simulator...");
  simulatorWs = new WebSocket("ws://localhost:8765");

  simulatorWs.on("open", () => {
    console.log("Connected to simulator");
  });

  simulatorWs.on("message", (raw) => {
    // Daten vom Simulator empfangen und an alle Frontend Clients weiterleiten
    const data = JSON.parse(raw.toString());
    latestData = data;
    io.emit("telemetry", data); // broadcast an alle verbundenen Browser
  });

  simulatorWs.on("close", () => {
    console.log("Simulator disconnected, retrying in 2s...");
    setTimeout(connectToSimulator, 2000); // automatisch neu verbinden
  });

  simulatorWs.on("error", (err) => {
    console.error("Simulator connection error:", err.message);
  });
}

// ─── Frontend Verbindungen ────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("Frontend client connected:", socket.id);

  // Sofort letzte Daten schicken damit das Dashboard nicht leer startet
  if (latestData) socket.emit("telemetry", latestData);

  // PID Parameter Updates vom Frontend an Simulator weiterleiten
  socket.on("pid_update", (params) => {
    if (simulatorWs?.readyState === WebSocket.OPEN) {
      simulatorWs.send(JSON.stringify(params));
    }
  });

  socket.on("disconnect", () => {
    console.log("Frontend client disconnected:", socket.id);
  });
});

// ─── Gemini API Endpoint ──────────────────────────────────────────────────────
// Frontend schickt die letzten Datenpunkte, wir fragen Gemini und geben Antwort zurück
app.post("/api/analyze", async (req, res) => {
  const { telemetryHistory } = req.body;

  const prompt = `
    You are an expert in automotive control systems and Formula Student racing.
    Analyze the following steering telemetry data and provide a brief, actionable insight (2-3 sentences max).
    Focus on: PID performance, temperature trends, or steering tracking quality.
    
    Data (last 50 samples):
    ${JSON.stringify(telemetryHistory)}
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json() as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No analysis available";
    res.json({ analysis: text });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// ─── Server starten ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  connectToSimulator();
});