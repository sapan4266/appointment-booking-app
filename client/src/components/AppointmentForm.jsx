
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { createAppointment } from "../services/appointmentService";
import { getHealthGuidance } from "../services/aiService";

function AppointmentForm({ onAppointmentCreated }) {
  const [formData, setFormData] = useState({
    patientName: "",
    mobileNumber: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: ""
  });

  const [reason, setReason] = useState("");
  const [summary, setSummary] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleGenerateSummary = async () => {
    if (!reason.trim()) {
      setError(
        "Please enter the patient's symptoms or health concern."
      );
      return;
    }

    try {
      setError("");
      setSummary("");
      setAiLoading(true);

      await getHealthGuidance(reason, (chunk) => {
        setSummary((previousSummary) => {
          return previousSummary + chunk;
        });
      });
    } catch (error) {
      setError(
        error.message ||
          "Unable to get AI health guidance."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.patientName.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.doctorName.trim() ||
      !formData.appointmentDate ||
      !formData.appointmentTime
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const response = await createAppointment(formData);

      setMessage(response.message);

      setFormData({
        patientName: "",
        mobileNumber: "",
        doctorName: "",
        appointmentDate: "",
        appointmentTime: ""
      });

      setReason("");
      setSummary("");

      onAppointmentCreated();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-card">
      <div className="section-heading">
        <div>
          <p className="section-label">NEW APPOINTMENT</p>

          <h2>Book an Appointment</h2>

          <p>
            Enter the patient and appointment details below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="patientName">
              Patient Name
            </label>

            <input
              id="patientName"
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="e.g. Rahul Kumar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">
              Mobile Number
            </label>

            <input
              id="mobileNumber"
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="doctorName">
              Doctor Name
            </label>

            <input
              id="doctorName"
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="e.g. Dr. Sharma"
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDate">
              Appointment Date
            </label>

            <input
              id="appointmentDate"
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointmentTime">
              Appointment Time
            </label>

            <input
              id="appointmentTime"
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">
              Symptoms / Reason for Visit
            </label>

            <textarea
              id="reason"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              placeholder="e.g. I have fever and body pain since yesterday"
              rows="3"
            />
          </div>
        </div>

        <div className="ai-section">
          <div className="ai-header">
            <div className="ai-header-content">
              <p className="section-label">
                AI HEALTH ASSISTANT
              </p>

              <h3>
                Get General Health Guidance
              </h3>

              <p>
                Describe the patient's symptoms to get
                general health information before the
                appointment.
              </p>
            </div>

            <button
              type="button"
              className="ai-button"
              onClick={handleGenerateSummary}
              disabled={aiLoading}
            >
              {aiLoading
                ? "Thinking..."
                : "Ask AI Assistant"}
            </button>
          </div>

          {summary && (
            <div className="ai-summary">
              <div className="ai-summary-title">
                <span>AI Health Guidance</span>

                {aiLoading && (
                  <span className="ai-typing">
                    AI is typing...
                  </span>
                )}
              </div>

              <div className="ai-content">
                <ReactMarkdown>
                  {summary}
                </ReactMarkdown>
              </div>

              {!aiLoading && (
                <div className="ai-disclaimer">
                  This information is for general guidance
                  and is not a medical diagnosis.
                </div>
              )}
            </div>
          )}
        </div>

        {message && (
          <p className="success-message">
            ✓ {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="form-footer">
          <p>
            Please verify the appointment details before
            booking.
          </p>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Booking..."
              : "Book Appointment"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AppointmentForm;

