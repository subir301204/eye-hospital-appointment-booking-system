const db = require(".../config/db");
const { v4: uuidv4 } = require("uuid");

// Helper: count bookings per date
const getBookingCount = (date, callback) => {
  db.query(
    "SELECT COUNT(*) AS count FROM appointment WHERE appointment_date=? AND status='Booked'",
    [date],
    callback
  );
};

// Book Appointment
exports.bookAppointment = (req, res) => {
  const { name, verification_id, date, department, doctor } = req.body;

  // Rule: Always 2 days before
  let today = new Date();
  let selected = new Date(date);
  let diffDays = (selected - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 2) {
    return res
      .status(400)
      .json({ message: "Appointment must be booked 2 days before" });
  }

  // Check Booking limit per day (limit = 5 for simplicity)
  getBookingCount(date, (err, result) => {
    if (result[0].count >= 5) {
      return res
        .status(400)
        .json({ message: "Appointment full, choose another date" });
    }

    db.query(
      "SELECT * FORM patients WHERE verification_id=?",
      [verification_id],
      (err, patients) => {
        if (patients.length === 0) {
          //First time patient must go to General department
          if (department !== "General") {
            return res.status(400).json({
              message: "First time patients must choose General Department",
            });
          }

          // Insert patient
          db.query(
            "INSERT INTO patients(name, verification_id) VALUES(?, ?)",
            [name, verification_id],
            (err, result) => {
              createAppointment(result.insertId);
            }
          );
        } else {
          createAppointment(patients[0].id);
        }
      }
    );

    function createAppointment(patient_id) {
      let booking_id = "EYE-" + Math.floor(10000 + Math.random() * 90000);

      if (department === "General") doctor = null;

      db.query(
        "INSERT INTO appointments(booking_id, patient_id, appointment_data, department, doctor) VALUES(?,?,?,?,?)",
        [booking_id, patient_id, date, department, doctor],
        (err) => {
          if (err) throw err;
          res.json({ message: "Appointment Booked", booking_id });
        }
      );
    }
  });
};

// Cancel Appointment
exports.cancelAppointment = (req, res) => {
  const { booking_id } = req.body;

  db.query(
    "UPDATE appointment SET status='Cancelled' WHERE booking_id=?",
    [booking_id],
    (err, result) => {
      if (result.affectedRows == 0)
        return res.status(404).json({ message: "Booking not found" });
      res.json({ message: "Appointment Cancelled" });
    }
  );
};

//Feedback
exports.addFeedback = (req, res) => {
  const { booking_id, message } = req.body;

  db.query(
    "INSERT INTO feedback(booking_id, message) VALUES(?, ?",
    [booking_id, message],
    () => res.json({ message: "Feedback Submitted" })
  );
};
