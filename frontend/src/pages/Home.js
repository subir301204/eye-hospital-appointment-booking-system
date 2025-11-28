import React, { useState } from "react";
import BookingForm from "../components/BookingForm";
import "../styles.css";

function Home() {
  const [message, setMessage] = useState("");

  return (
    <div className="app-container">
      <h1>Eye Hospital Appointment</h1>

      <BookingForm setMessage={setMessage} />

      {message && <div className="success-message">{message}</div>}
    </div>
  );
}

export default Home;
