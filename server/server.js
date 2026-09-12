const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const appointmentRoutes = require("./routes/appointmentRoutes");
const aiRoutes = require("./routes/aiRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Appointment routes
app.use("/api/appointments", appointmentRoutes);

// AI routes
app.use("/api/ai", aiRoutes);

// Temporary AI route test
app.get("/api/ai/test", (req, res) => {
  res.json({
    message: "AI route is available"
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Appointment Booking API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});