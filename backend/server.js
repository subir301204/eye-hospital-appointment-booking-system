const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "eye_hospital",
});

// ----------------------------
// 1️⃣ BOOK APPOINTMENT
// ----------------------------
app.post("/api/appointments/book", (req, res) => {
  const {
    verification_id,
    department,
    doctor_id,
    appointment_date,
    previous_booking_id,
    name,
  } = req.body;

  const sql = `INSERT INTO appointments 
      (verification_id, department, doctor_id, appointment_date, previous_booking_id, name, status) 
      VALUES (?, ?, ?, ?, ?, ?, 'Booked')`;

  db.query(
    sql,
    [
      verification_id,
      department,
      doctor_id,
      appointment_date,
      previous_booking_id,
      name,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });

      return res.json({
        message: "Appointment booked successfully",
        booking_id: result.insertId,
      });
    }
  );
});

// ----------------------------
// 2️⃣ CHECK STATUS
// ----------------------------
app.get("/api/appointments/status/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT status FROM appointments WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0)
      return res.status(404).json({ message: "Booking not found" });

    return res.json({ status: results[0].status });
  });
});

// ----------------------------
// 3️⃣ CANCEL APPOINTMENT
// ----------------------------
app.post("/api/appointments/cancel", (req, res) => {
  const { booking_id } = req.body;

  const sql = "UPDATE appointments SET status = 'Cancelled' WHERE id = ?";

  db.query(sql, [booking_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Booking ID not found" });

    return res.json({ message: "Appointment cancelled successfully" });
  });
});

// ----------------------------
// 4️⃣ SUBMIT FEEDBACK
// ----------------------------
app.post("/api/appointments/feedback", (req, res) => {
  const { booking_id, message } = req.body;

  const sql = "INSERT INTO feedback (booking_id, message) VALUES (?, ?)";

  db.query(sql, [booking_id, message], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    return res.json({ message: "Feedback submitted successfully" });
  });
});

// ----------------------------
app.listen(5000, () => console.log("Backend running on port 5000"));
