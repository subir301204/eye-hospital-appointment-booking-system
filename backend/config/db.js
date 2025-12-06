// backend/config/db.js
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config(); // load variables from .env if present

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "eye_hospital",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Stop server if DB connection fails
  } else {
    console.log("Connected to MySQL database.");
  }
});

export default db;
