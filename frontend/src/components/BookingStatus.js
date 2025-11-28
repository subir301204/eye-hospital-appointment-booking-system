import React, { useState } from "react";

function BookingStatus() {
  const [bookingId, setBookingId] = useState("");
  const [status, setStatus] = useState("");

  const checkStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/status/${bookingId}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Booking not found");
      }

      setStatus(`✅ Status: ${data.status}`);
    } catch (err) {
      setStatus("❌ Booking not found or error occurred");
    }
  };

  return (
    <div className="status-box">
      <h3>Check Booking Status</h3>
      <input
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />
      <button onClick={checkStatus}>Check Status</button>
      <p>{status}</p>
    </div>
  );
}

export default BookingStatus;
