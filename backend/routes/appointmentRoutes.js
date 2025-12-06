import express from "express";
import db from "../config/db.js"; // <- ES module import

const router = express.Router();

router.post("/book", (req, res) => {
  const { patient_id, appointment_date, department, doctor } = req.body;

  if (!patient_id || !appointment_date || !department || !doctor) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO appointments (patient_id, appointment_date, department, doctor) VALUES (?, ?, ?, ?)`;
  db.query(
    sql,
    [patient_id, appointment_date, department, doctor],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Appointment booked", bookingId: result.insertId });
    }
  );
});

export default router;
