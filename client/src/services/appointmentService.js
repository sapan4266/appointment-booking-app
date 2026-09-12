import axios from "axios";

const API_URL =  "https://appointment-booking-app-1-1oqd.onrender.com/api/appointments";

export const getAppointments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await axios.post(API_URL, appointmentData);
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    { status }
  );

  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};