import React, { useState } from "react";

function Feedback() {
  const [booking, setBooking] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submit = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/appointments/feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: booking, message }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setStatus("✅ Feedback sent successfully!");
      setBooking("");
      setMessage("");
    } catch (err) {
      setStatus("❌ Error sending feedback.");
    }
  };

  return (
    <div className="feedback-box">
      <h3>Give Feedback</h3>
      <input
        placeholder="Enter Booking ID"
        value={booking}
        onChange={(e) => setBooking(e.target.value)}
      />
      <textarea
        placeholder="Enter your feedback"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={submit}>Submit</button>
      <p>{status}</p>
    </div>
  );
}

export default Feedback;
