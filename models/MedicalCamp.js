const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  staff: [{ type: String, trim: true }],
  capacity: { type: Number, required: true, min: 1 },
  active: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model("MedicalCamp", schema);
