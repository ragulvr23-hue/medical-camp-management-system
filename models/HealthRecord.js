const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  medicalHistory: String,
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"], default: "Unknown" },
  allergies: String,
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment: String,
  advice: String,
  bloodPressure: String,
  temperature: Number,
  heightCm: Number,
  weightKg: Number,
  doctor: { type: String, required: true },
  visitDate: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model("HealthRecord", schema);
