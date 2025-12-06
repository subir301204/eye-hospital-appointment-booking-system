import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/book", (req, res) => {
  const { name, verification_id, appointment_date, department, doctor_id } = req.body;

  if (!name || !verification_id || !appointment_date || !department) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 1. Check if patient exists or create new
  const checkPatientSql = "SELECT id FROM patients WHERE verification_id = ?";
  db.query(checkPatientSql, [verification_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error checking patient" });
    }

    let patientId;

    if (results.length > 0) {
      // Patient exists
      patientId = results[0].id;
      bookAppointment(patientId);
    } else {
      // Create new patient
      const createPatientSql = "INSERT INTO patients (name, verification_id) VALUES (?, ?)";
      db.query(createPatientSql, [name, verification_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error creating patient" });
        }
        patientId = result.insertId;
        bookAppointment(patientId);
      });
    }

    // Helper to book appointment after patient is resolved
    function bookAppointment(pId) {
      const bookingId = "BK-" + Date.now(); // Simple booking ID generation
      const sql = `INSERT INTO appointments (booking_id, patient_id, appointment_date, department, doctor) VALUES (?, ?, ?, ?, ?)`;

      db.query(
        sql,
        [bookingId, pId, appointment_date, department, doctor_id || 'Any'],
        (err, result) => {
          if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ message: "Database error creating appointment" });
          }
          res.json({ message: "Appointment booked", booking_id: bookingId });
        }
      );
    }
  });
});

router.get("/status/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const sql = `
    SELECT a.*, p.name as patient_name 
    FROM appointments a 
    JOIN patients p ON a.patient_id = p.id 
    WHERE a.booking_id = ?
  `;

  db.query(sql, [bookingId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(results[0]);
  });
});

router.post("/cancel", (req, res) => {
  const { booking_id } = req.body;
  if (!booking_id) return res.status(400).json({ message: "Missing booking ID" });

  const sql = "UPDATE appointments SET status = 'Cancelled' WHERE booking_id = ?";
  db.query(sql, [booking_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Appointment cancelled successfully" });
  });
});

router.post("/feedback", (req, res) => {
  const { booking_id, message } = req.body;
  if (!booking_id || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql = "INSERT INTO feedback (booking_id, message) VALUES (?, ?)";
  db.query(sql, [booking_id, message], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Feedback submitted" });
  });
});

export default router;
