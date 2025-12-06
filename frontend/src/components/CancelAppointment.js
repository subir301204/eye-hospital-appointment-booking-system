import React, { useState } from "react";

function CancelAppointment() {
  const [bookingId, setBookingId] = useState("");
  const [message, setMessage] = useState("");

  const cancel = async () => {
    if (!bookingId) {
      setMessage("Please enter a booking ID.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="card">
      <h3>Cancel Appointment</h3>

      <input
        className="input-box"
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />

      <button className="btn" onClick={cancel}>
        Cancel Appointment
      </button>

      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default CancelAppointment;
