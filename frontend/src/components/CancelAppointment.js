import React, { useState } from "react";
import "../styles.css";

function CancelAppointment() {
  const [bookingId, setBookingId] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const cancelBooking = async (e) => {
    e.preventDefault();
    setStatusMsg("");

    if (!bookingId.trim()) {
      setStatusMsg("Please enter Booking ID");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMsg("❌ " + (data.message || "Cancellation failed"));
      } else {
        setStatusMsg("✅ " + (data.message || "Cancelled"));
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Server error");
    }
  };

  return (
    <div className="app-container" style={{ marginTop: "30px" }}>
      <h2>Cancel Appointment</h2>

      <form onSubmit={cancelBooking}>
        <input
          type="text"
          placeholder="Enter Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />

        <button type="submit">Cancel Appointment</button>
      </form>

      {statusMsg && <p className="success-message">{statusMsg}</p>}
    </div>
  );
}

export default CancelAppointment;
