import React, { useState } from "react";
import "../styles.css";

function BookingStatus() {
  const [bookingId, setBookingId] = useState("");
  const [message, setMessage] = useState("");

  const checkStatus = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!bookingId.trim()) {
      setMessage("Please enter Booking ID");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/appointments/status/${bookingId}`
      );
      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ " + (data.message || "Booking not found"));
      } else {
        setMessage("✅ Status: " + (data.status || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again.");
    }
  };

  return (
    <div className="app-container" style={{ marginTop: 20 }}>
      <h2>Check Appointment Status</h2>

      <form onSubmit={checkStatus}>
        <input
          type="text"
          placeholder="Enter Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />

        <button type="submit">Check Status</button>
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

export default BookingStatus;
