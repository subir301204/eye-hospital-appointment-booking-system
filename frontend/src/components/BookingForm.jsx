import React, { useState, useEffect } from "react";
import "../styles.css";

function BookingForm() {
  const [name, setName] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("General");
  const [doctor, setDoctor] = useState("");
  const [prevBookingId, setPrevBookingId] = useState("");
  const [message, setMessage] = useState("");

  const doctorsByDepartment = {
    General: [],
    Cornea: ["Dr. Amit Sharma", "Dr. Rina Patel"],
    Retina: ["Dr. Kunal Verma", "Dr. Sneha Roy"],
    Glaucoma: ["Dr. Rakesh Gupta"],
  };

  // Rule 1: Min date is 2 days from now
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split("T")[0];
  };

  // Rule 2: If no previous booking ID, force General department
  useEffect(() => {
    if (!prevBookingId) {
      setDepartment("General");
      setDoctor("");
    }
  }, [prevBookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!verificationId || !date || !name) {
      setMessage("Please fill all required fields.");
      return;
    }

    // Call backend
    try {
      const res = await fetch("http://localhost:3000/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verification_id: verificationId,
          department,
          doctor_id: doctor || null,
          appointment_date: date,
          previous_booking_id: prevBookingId || null,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ " + (data.message || "Booking failed"));
      } else {
        setMessage("✅ Booked. Booking ID: " + data.booking_id);
        // Optional: clear fields
        setName("");
        setVerificationId("");
        setDate("");
        setDepartment("General");
        setDoctor("");
        setPrevBookingId("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again.");
    }
  };

  return (
    <div className="app-container">
      <h2>Book Appointment</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Verification ID (Aadhaar / ID)"
          value={verificationId}
          onChange={(e) => setVerificationId(e.target.value)}
        />

        <label style={{ textAlign: "left", fontSize: "0.9rem", color: "#555" }}>
          Appointment Date (Min key 2 days later)
        </label>
        <input
          type="date"
          min={getMinDate()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Previous Booking ID (Optional)"
          value={prevBookingId}
          onChange={(e) => setPrevBookingId(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setDoctor("");
          }}
          disabled={!prevBookingId}
          title={!prevBookingId ? "Only General available for new patients" : "Select Department"}
        >
          <option value="General">General Department</option>
          <option value="Cornea">Cornea</option>
          <option value="Retina">Retina</option>
          <option value="Glaucoma">Glaucoma</option>
        </select>

        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          disabled={department === "General"}
        >
          <option value="">Select Doctor</option>
          {doctorsByDepartment[department].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button type="submit">Book Appointment</button>
      </form>

      {message && (
        <p
          className={
            message.startsWith("✅") ? "success-message" : "error-message"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default BookingForm;
