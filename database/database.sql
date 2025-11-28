CREATE DATABASE eye_hospital;
USE eye_hospital;

CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  verification_id VARCHAR(50) UNIQUE,
  is_first_time BOOLEAN DEFAULT TRUE
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(20) UNIQUE,
  patient_id INT,
  appointment_date DATE,
  department VARCHAR(50),
  doctor VARCHAR(50),
  status VARCHAR(20) DEFAULT 'Booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(20),
  message TEXT
);