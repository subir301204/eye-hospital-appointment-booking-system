import React, { useState } from "react";
import "../styles.css"; // ensure CSS is imported

function CancelAppointment() {
  const [bookingId, setBookingId] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const cancel = async () => {
    if (!bookingId) {
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
      if (res.ok) {
        setStatusMsg("✅ " + data.message);
      } else {
        setStatusMsg("❌ " + (data.message || "Cancellation failed"));
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Server error");
    }
  };

  return (
    <div className="app-container" style={{ marginTop: "30px" }}>
      <h2>Cancel Appointment</h2>
      <input
        type="text"
        placeholder="Enter Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />
      <button onClick={cancel}>Cancel Appointment</button>
      {statusMsg && <p className="success-message">{statusMsg}</p>}
    </div>
  );
}

export default CancelAppointment;
