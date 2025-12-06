import React from "react";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import CancelAppointment from "./components/CancelAppointment";
import Feedback from "./components/Feedback";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Eye Hospital Appointment System
      </h1>

      <BookingForm />

      <BookingStatus />

      <CancelAppointment />

      <Feedback />
    </div>
  );
}

export default App;
