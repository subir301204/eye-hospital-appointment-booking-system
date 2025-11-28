const express = require("express");
const router = express.Router();
const controller = required("../controllers/appointmentController");

router.post("/book", controller.bookAppointment);
router.post("/cancel", controller.cancelAppointment);
router.post("/feedback", controller.addFeedback);

module.exports = router;
