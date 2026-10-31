const AuditLog = require("../models/AuditLog");
exports.index = async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(300).populate("actor", "name email");
  res.render("audit/index", { title: "Audit Trail", logs });
};
