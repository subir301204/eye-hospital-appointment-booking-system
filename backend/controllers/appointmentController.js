import db from "../config/db.js";
import crypto from "crypto";

// Helper to generate booking ID
function generateBookingId() {
  return "BK" + Math.floor(100000 + Math.random() * 900000);
}

// BOOK APPOINTMENT
export const bookAppointment = (req, res) => {
  const {
    verification_id,
    department,
    doctor_id,
    appointment_date,
    previous_booking_id,
  } = req.body;

  // RULE 1 - Must book 2 days before
  const today = new Date();
  const selected = new Date(appointment_date);
  const diff = (selected - today) / (1000 * 3600 * 24);

  if (diff < 2)
    return res
      .status(400)
      .json({ message: "Booking must be made 2 days before." });

  // RULE - Limit bookings per day
  db.query(
    "SELECT COUNT(*) AS count FROM appointments WHERE appointment_date = ?",
    [appointment_date],
    (err, result) => {
      if (result[0].count >= 20) {
        return res
          .status(400)
          .json({ message: "Booking limit reached for this date." });
      }

      // Check if patient exists
      db.query(
        "SELECT * FROM patients WHERE verification_id = ?",
        [verification_id],
        (err, patients) => {
          let patient_id;
          let is_first_time = false;

          if (patients.length === 0) {
            // First-time patient
            db.query(
              "INSERT INTO patients (verification_id) VALUES (?)",
              [verification_id],
              (err, result) => {
                patient_id = result.insertId;
                is_first_time = true;
                continueBooking();
              }
            );
          } else {
            patient_id = patients[0].id;
            is_first_time = patients[0].is_first_time;
            continueBooking();
          }

          function continueBooking() {
            // RULE — First-time must choose General
            if (is_first_time && department !== "General") {
              return res.status(400).json({
                message: "First-time patients must book in General department.",
              });
            }

            // RULE — If selecting General, doctor must be null
            const finalDoctor = department === "General" ? null : doctor_id;

            const booking_id = generateBookingId();

            const sql = `
              INSERT INTO appointments 
              (patient_id, booking_id, department, doctor_id, appointment_date, time_slot, previous_booking_id) 
              VALUES (?, ?, ?, ?, ?, '10:00 AM - 11:00 AM', ?)
            `;

            db.query(
              sql,
              [
                patient_id,
                booking_id,
                department,
                finalDoctor,
                appointment_date,
                previous_booking_id || null,
              ],
              () => {
                // Mark first-time as false
                if (is_first_time) {
                  db.query(
                    "UPDATE patients SET is_first_time = FALSE WHERE id=?",
                    [patient_id]
                  );
                }

                res.json({ booking_id, message: "Booking successful" });
              }
            );
          }
        }
      );
    }
  );
};

// CHECK STATUS
export const checkStatus = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT status FROM appointments WHERE booking_id=?",
    [id],
    (err, result) => {
      if (!result.length) return res.status(404).json({ message: "Not found" });
      res.json({ status: result[0].status });
    }
  );
};

// FEEDBACK
export const feedback = (req, res) => {
  const { booking_id, message } = req.body;

  db.query(
    "INSERT INTO feedback (booking_id, message) VALUES (?, ?)",
    [booking_id, message],
    () => {
      res.json({ message: "Feedback sent!" });
    }
  );
};

// CANCEL BOOKING
export const cancelBooking = (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ message: "Booking ID is required" });
  }

  db.query(
    "UPDATE appointments SET status='Cancelled' WHERE booking_id=?",
    [booking_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json({ message: "Booking cancelled successfully" });
    }
  );
};
