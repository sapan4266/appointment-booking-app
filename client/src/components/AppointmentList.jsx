function AppointmentList({
  appointments,
  onStatusChange,
  onDelete
}) {
  if (appointments.length === 0) {
    return (
      <section className="empty-state">
        <div className="empty-icon">+</div>

        <h3>No appointments yet</h3>

        <p>
          Once you book an appointment, it will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="list-card">

      <div className="list-header">
        <div>
          <p className="section-label">APPOINTMENT LIST</p>

          <h2>Appointments</h2>

          <p>
            View and manage all patient appointments.
          </p>
        </div>

        <div className="appointment-count">
          {appointments.length}{" "}
          {appointments.length === 1
            ? "Appointment"
            : "Appointments"}
        </div>
      </div>

      <div className="table-wrapper">
        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Mobile</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>

                <td>
                  <div className="patient-cell">
                    <div className="patient-avatar">
                      {appointment.patientName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span>
                      {appointment.patientName}
                    </span>
                  </div>
                </td>

                <td>{appointment.mobileNumber}</td>

                <td>{appointment.doctorName}</td>

                <td>{appointment.appointmentDate}</td>

                <td>{appointment.appointmentTime}</td>

                <td>
                  <span
                    className={`status ${appointment.status.toLowerCase()}`}
                  >
                    <span className="status-dot"></span>

                    {appointment.status}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">

                    {appointment.status === "Booked" && (
                      <>
                        <button
                          className="complete-button"
                          onClick={() =>
                            onStatusChange(
                              appointment._id,
                              "Completed"
                            )
                          }
                        >
                          Complete
                        </button>

                        <button
                          className="cancel-button"
                          onClick={() =>
                            onStatusChange(
                              appointment._id,
                              "Cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    <button
                      className="delete-button"
                      onClick={() =>
                        onDelete(appointment._id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </section>
  );
}

export default AppointmentList;