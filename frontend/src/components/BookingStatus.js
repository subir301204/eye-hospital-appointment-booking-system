import React, { useState } from "react";
import "../styles.css";

function BookingStatus() {
  const [bookingId, setBookingId] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const checkStatus = async (e) => {
    e.preventDefault();
    setStatusMsg("");

    if (!bookingId.trim()) {
      setStatusMsg("Please enter Booking ID");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/status/${bookingId}`
      );
      const data = await res.json();

      if (!res.ok) {
        setStatusMsg("❌ Booking not found");
      } else {
        setStatusMsg("✅ Status: " + (data.status || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Server error");
    }
  };

  return (
    <div className="app-container" style={{ marginTop: "30px" }}>
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

      {statusMsg && <p className="success-message">{statusMsg}</p>}
    </div>
  );
}

export default BookingStatus;
