import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Load the .env file from the parent directory (since server.js is in /src)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debugging: Let's check if it sees the variable now
console.log("DEBUG - Mongo URI:", process.env.MONGO_URI);

import express from "express";

import cors from "cors";
import mongoose from "mongoose";

// --- Import Routes ---
// Routes are in the same 'src' parent folder, so we look into './routes'
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import jobRoutes from "./routes/jobs.js"; 
import applicationRoutes from "./routes/applications.js";

// Load .env from the parent directory (since we are in src)
dotenv.config({ path: "../.env" }); 
// If that doesn't work, standard dotenv.config() often finds it if you run from root.
// But the explicit path is safer here.

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// --- Routes Mounting ---
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Active", message: "Server is running smoothly" });
});

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Backend available at http://localhost:${PORT}/api`);
});