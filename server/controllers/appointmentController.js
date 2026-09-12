const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const {
      patientName,
      mobileNumber,
      doctorName,
      appointmentDate,
      appointmentTime
    } = req.body;

    if (
      !patientName ||
      !mobileNumber ||
      !doctorName ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        message: "All appointment fields are required"
      });
    }

    const appointment = await Appointment.create({
      patientName,
      mobileNumber,
      doctorName,
      appointmentDate,
      appointmentTime
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });
  } catch (error) {
    console.error("Create appointment error:", error.message);

    res.status(500).json({
      message: "Failed to create appointment"
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      createdAt: -1
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error.message);

    res.status(500).json({
      message: "Failed to get appointments"
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      message: `Appointment marked as ${status}`,
      appointment
    });
  } catch (error) {
    console.error("Update status error:", error.message);

    res.status(500).json({
      message: "Failed to update appointment status"
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    console.error("Delete appointment error:", error.message);

    res.status(500).json({
      message: "Failed to delete appointment"
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
};