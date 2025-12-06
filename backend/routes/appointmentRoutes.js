import express from "express";
import {
  bookAppointment,
  checkStatus,
  feedback,
  cancelBooking,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/book", bookAppointment);
router.get("/status/:id", checkStatus);
router.post("/feedback", feedback);

// New cancel router
router.post("/cancel", cancelBooking);

export default router;
