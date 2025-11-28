import React, { useState } from "react";

function CancelAppointment() {
  const [bookingId, setBookingId] = useState("");

  const cancel = async () => {
    const res = await fetch("http://localhost:5000/api/appointments/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h3>Cancel Appointment</h3>
      <input
        placeholder="Booking ID"
        onChange={(e) => setBookingId(e.target.value)}
      />
      <button onClick={cancel}>Cancel</button>
    </div>
  );
}

export default CancelAppointment;
