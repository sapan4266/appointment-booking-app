const express = require("express");

const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", createAppointment);

router.get("/", getAppointments);

router.patch("/:id/status", updateAppointmentStatus);

router.delete("/:id", deleteAppointment);

module.exports = router;