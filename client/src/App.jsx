import { useEffect, useState } from "react";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from "./services/appointmentService";
import "./App.css";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      setError("");

      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      setError("Unable to load appointments.");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleAppointmentCreated = () => {
    loadAppointments();
  };

  const handleStatusChange = async (id, status) => {
    try {
      setError("");

      await updateAppointmentStatus(id, status);
      loadAppointments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update appointment."
      );
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");

      await deleteAppointment(id);
      loadAppointments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete appointment."
      );
    }
  };

  const totalAppointments = appointments.length;

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.status === "Booked"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelled"
  ).length;

  return (
    <div className="app">

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div>
            <p className="eyebrow">APPOINTMENT MANAGER</p>

            <h1>Appointment Booking</h1>

            <p className="header-description">
              Book and manage patient appointments in one place.
            </p>
          </div>
        </div>
      </header>

      <main className="container">

        {/* Error */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <p>Total Appointments</p>
            <h2>{totalAppointments}</h2>
          </div>

          <div className="stat-card">
            <p>Booked</p>
            <h2>{bookedAppointments}</h2>
          </div>

          <div className="stat-card">
            <p>Completed</p>
            <h2>{completedAppointments}</h2>
          </div>

          <div className="stat-card">
            <p>Cancelled</p>
            <h2>{cancelledAppointments}</h2>
          </div>

        </section>

        {/* Booking Form */}
        <AppointmentForm
          onAppointmentCreated={handleAppointmentCreated}
        />

        {/* Appointment List */}
        <AppointmentList
          appointments={appointments}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />

      </main>
    </div>
  );
}

export default App;