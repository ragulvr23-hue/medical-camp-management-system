const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, trim: true, default: "General", maxlength: 60 },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  unit: { type: String, trim: true, default: "units", maxlength: 20 },
  reorderLevel: { type: Number, min: 0, default: 10 },
  batchNumber: { type: String, trim: true, maxlength: 60 },
  expiryDate: { type: Date, default: null },
  notes: { type: String, maxlength: 500 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
schema.index({ name: 1, batchNumber: 1 });
module.exports = mongoose.model("InventoryItem", schema);
