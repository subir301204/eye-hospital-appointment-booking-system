import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql@go",
  database: "eye_hospital",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

export default db;
