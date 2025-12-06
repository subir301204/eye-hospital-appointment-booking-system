import React, { useState } from "react";
import "../styles.css";

function CancelAppointment() {
  const [bookingId, setBookingId] = useState("");
  const [message, setMessage] = useState("");

  const cancel = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!bookingId.trim()) {
      setMessage("Please enter Booking ID");
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
        setMessage("❌ " + (data.message || "Cancellation failed"));
      } else {
        setMessage("✅ " + (data.message || "Cancelled successfully"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error. Try again.");
    }
  };

  return (
    <div className="app-container" style={{ marginTop: 20 }}>
      <h2>Cancel Appointment</h2>

      <form onSubmit={cancel}>
        <input
          type="text"
          placeholder="Enter Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />

        <button type="submit">Cancel Appointment</button>
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

export default CancelAppointment;
