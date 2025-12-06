import React from "react";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import Feedback from "./components/Feedback";
import CancelAppointment from "./components/CancelAppointment";
import "./App.css"; // Ensure CSS is imported if it was in the original boilerplate, though App.js didn't have it.

function App() {
  return (
    <div className="app-container">
      <h1>Eye Hospital Appointment System</h1>
      {/* Main appointment booking */}
      <BookingForm />
      {/* Status checker */}
      <BookingStatus />
      {/* Cancel appointment */}
      <CancelAppointment />
      {/* Feedback */}
      <Feedback />
    </div>
  );
}

export default App;
