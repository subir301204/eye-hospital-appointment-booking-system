import express from "express";
import cors from "cors";
import appointmentRoutes from "./routes/appointmentRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));
