const AuditLog = require("../models/AuditLog");
module.exports = async function audit(req, action, entity, entityId = "", details = "") {
  try {
    const user = req.session?.user || {};
    await AuditLog.create({
      actor: user.id || null,
      actorName: user.name || "System",
      actorRole: user.role || "system",
      action, entity, entityId: String(entityId || ""),
      details: String(details || "").slice(0, 500),
      ipAddress: String(req.ip || "").slice(0, 64)
    });
  } catch (error) {
    console.error("Audit log could not be saved:", error.message);
  }
};
