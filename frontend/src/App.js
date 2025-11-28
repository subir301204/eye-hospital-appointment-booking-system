import React from "react";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import Feedback from "./components/Feedback";

function App() {
  return (
    <div className="app-container">
      <h1>Eye Hospital Appointment System</h1>

      {/* Main Appointment Booking */}
      <BookingForm />

      {/* Booking Status Checker */}
      <BookingStatus />

      {/* Feedback Section */}
      <Feedback />
    </div>
  );
}

export default App;
