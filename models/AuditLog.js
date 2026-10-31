const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  actorName: { type: String, default: "System" },
  actorRole: { type: String, default: "system" },
  action: { type: String, required: true, maxlength: 80 },
  entity: { type: String, required: true, maxlength: 80 },
  entityId: { type: String, default: "" },
  details: { type: String, default: "", maxlength: 500 },
  ipAddress: { type: String, default: "" }
}, { timestamps: true });
schema.index({ createdAt: -1 });
module.exports = mongoose.model("AuditLog", schema);
