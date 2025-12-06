import express from "express";
import db from "../database/db.js";

const router = express.Router();

// -----------------------------
// 1️⃣ BOOK APPOINTMENT
// -----------------------------
router.post("/book", (req, res) => {
  const { name, verification_id, appointment_date, department, doctor } =
    req.body;

  if (
    !name ||
    !verification_id ||
    !appointment_date ||
    !department ||
    !doctor
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  // 1. Check if patient exists
  const findPatient = "SELECT id FROM patients WHERE verification_id = ?";
  db.query(findPatient, [verification_id], (err, patientResult) => {
    if (err) return res.status(500).json({ message: "Database error" });

    let patientId;

    if (patientResult.length === 0) {
      // 2. Insert new patient
      const insertPatient =
        "INSERT INTO patients (name, verification_id) VALUES (?, ?)";
      db.query(insertPatient, [name, verification_id], (err, newPatient) => {
        if (err)
          return res.status(500).json({ message: "Error creating patient" });
        patientId = newPatient.insertId;

        createAppointment(patientId);
      });
    } else {
      // Existing patient
      patientId = patientResult[0].id;
      createAppointment(patientId);
    }

    function createAppointment(patientId) {
      const bookingId = "BKG" + Math.floor(100000 + Math.random() * 900000);

      const insertAppt =
        "INSERT INTO appointments (booking_id, patient_id, appointment_date, department, doctor) VALUES (?, ?, ?, ?, ?)";

      db.query(
        insertAppt,
        [bookingId, patientId, appointment_date, department, doctor],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error booking appointment" });

          return res.json({
            message: "Appointment booked successfully",
            booking_id: bookingId,
          });
        }
      );
    }
  });
});

// -----------------------------
// 2️⃣ CHECK APPOINTMENT STATUS
// -----------------------------
router.get("/status/:booking_id", (req, res) => {
  const { booking_id } = req.params;

  const sql = "SELECT status FROM appointments WHERE booking_id = ?";
  db.query(sql, [booking_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0)
      return res.status(404).json({ message: "Invalid Booking ID" });

    res.json({ status: result[0].status });
  });
});

// -----------------------------
// 3️⃣ CANCEL APPOINTMENT
// -----------------------------
router.post("/cancel", (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id)
    return res.status(400).json({ message: "Booking ID required" });

  const sql =
    "UPDATE appointments SET status = 'Canceled' WHERE booking_id = ?";
  db.query(sql, [booking_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Booking ID not found" });

    res.json({ message: "Appointment canceled successfully" });
  });
});

// -----------------------------
// 4️⃣ SUBMIT FEEDBACK
// -----------------------------
router.post("/feedback", (req, res) => {
  const { booking_id, message } = req.body;

  if (!booking_id || !message)
    return res.status(400).json({ message: "Both fields required" });

  const sql = "INSERT INTO feedback (booking_id, message) VALUES (?, ?)";
  db.query(sql, [booking_id, message], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });

    res.json({ message: "Feedback sent successfully" });
  });
});

export default router;
