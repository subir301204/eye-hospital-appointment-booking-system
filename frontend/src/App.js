import React from "react";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import Feedback from "./components/Feedback";
import CancelAppointment from "./components/CancelAppointment"; // <-- add this

function App() {
  return (
    <div className="app-container">
      <h1>Eye Hospital Appointment System</h1>
      {/* Main appointment booking */}
      <BookingForm />
      {/* Status checker */}
      <BookingStatus />
      {/* Cancel appointment */}
      <CancelAppointment /> {/* <-- add this */}
      {/* Feedback */}
      <Feedback />
    </div>
  );
}

export default App;
