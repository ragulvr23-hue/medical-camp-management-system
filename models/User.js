const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff", "doctor", "student"], default: "student" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  active: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
