import React, { useState } from "react";

const doctorsByDepartment = {
  General: [],
  Cornea: ["Dr. Amit Sharma", "Dr. Rina Patel"],
  Retina: ["Dr. Kunal Verma", "Dr. Sneha Roy"],
  Glaucoma: ["Dr. Rakesh Gupta"],
};

function BookingForm({ setMessage }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("General");
  const [doctor, setDoctor] = useState("");
  const [previousId, setPreviousId] = useState("");
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);

  const handlePreviousIdChange = (e) => {
    const value = e.target.value;
    setPreviousId(value);

    // Fake validation (Later it will be from backend)
    if (value.startsWith("EYE")) {
      setHasVisitedBefore(true);
    } else {
      setHasVisitedBefore(false);
      setDepartment("General");
      setDoctor("");
    }
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setDoctor("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !date) {
      alert("Please fill required fields");
      return;
    }

    // Rule: First time patients ONLY General
    if (!hasVisitedBefore && department !== "General") {
      alert("First time patients can only select General department.");
      return;
    }

    // Rule: For non-general department, doctor is mandatory
    if (department !== "General" && doctor === "") {
      alert("Select a doctor");
      return;
    }

    const bookingId = "EYE" + Math.floor(10000 + Math.random() * 90000);

    setMessage(
      `✅ Appointment Confirmed!
New Booking ID: ${bookingId}
Previous Booking ID: ${previousId || "None"}
Department: ${department}
Doctor: ${doctor || "Assigned After Diagnosis"}`
    );

    // Reset fields
    setName("");
    setDate("");
    setDepartment("General");
    setDoctor("");
    setPreviousId("");
    setHasVisitedBefore(false);
  };

  return (
    <form>
      {/* Previous Booking ID */}
      <input
        type="text"
        placeholder="Previous Booking ID (If any)"
        value={previousId}
        onChange={handlePreviousIdChange}
      />

      {/* Patient Name */}
      <input
        type="text"
        placeholder="Patient Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Department */}
      <select
        value={department}
        onChange={handleDepartmentChange}
        disabled={!hasVisitedBefore}
      >
        <option value="General">General Department</option>
        <option value="Cornea">Cornea</option>
        <option value="Retina">Retina</option>
        <option value="Glaucoma">Glaucoma</option>
      </select>

      {/* Doctor */}
      <select
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
        disabled={department === "General"}
      >
        <option value="">Select Doctor</option>

        {doctorsByDepartment[department]?.map((doc, index) => (
          <option key={index} value={doc}>
            {doc}
          </option>
        ))}

        {department === "General" && (
          <option disabled>Doctor assigned after diagnosis</option>
        )}
      </select>

      <button onClick={handleSubmit}>Book Appointment</button>
    </form>
  );
}

export default BookingForm;
