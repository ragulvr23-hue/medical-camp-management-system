const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  age: { type: Number, required: true, min: 1, max: 120 },
  gender: { type: String, enum: ["Female", "Male", "Other"], required: true },
  department: { type: String, required: true, trim: true },
  className: { type: String, trim: true },
  contact: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  guardianName: { type: String, required: true, trim: true },
  guardianContact: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model("Student", schema);
