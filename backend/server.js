const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/appointments", require("./routes/appointmentRoutes"));

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
