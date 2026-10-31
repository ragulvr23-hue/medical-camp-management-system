const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, maxlength: 1500 },
  target: { type: String, enum: ["All", "Department"], default: "All" },
  department: { type: String, default: "" },
  publishAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
module.exports = mongoose.model("Notification", schema);
