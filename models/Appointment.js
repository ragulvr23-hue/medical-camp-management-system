const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  camp: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalCamp", required: true },
  appointmentDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
  notes: { type: String, maxlength: 500 }
}, { timestamps: true });
schema.index({ student: 1, camp: 1 }, { unique: true });
module.exports = mongoose.model("Appointment", schema);
