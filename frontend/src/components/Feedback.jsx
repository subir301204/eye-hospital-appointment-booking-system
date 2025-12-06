import React, { useState } from "react";
import "../styles.css";

function Feedback() {
  const [booking, setBooking] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch(
        "http://localhost:3000/api/appointments/feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_id: booking, message }),
        }
      );

      if (!res.ok) {
        setStatus("❌ Failed to submit feedback");
      } else {
        setStatus("✅ Feedback sent!");
        setBooking("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error");
    }
  };

  return (
    <div className="app-container" style={{ marginTop: 20 }}>
      <h2>Give Feedback</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Booking ID"
          value={booking}
          onChange={(e) => setBooking(e.target.value)}
        />
        <textarea
          placeholder="Your feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Submit Feedback</button>
      </form>
      {status && (
        <p
          className={
            status.startsWith("✅") ? "success-message" : "error-message"
          }
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default Feedback;
