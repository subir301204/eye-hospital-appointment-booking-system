// File: D:/Projects/eye hospital appointment booking system/backend/server.js

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample route to test server
app.get("/", (req, res) => {
  res.send("Eye Hospital Appointment Backend is running!");
});

import appointmentRoutes from "./routes/appointmentRoutes.js";
app.use("/api/appointments", appointmentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
