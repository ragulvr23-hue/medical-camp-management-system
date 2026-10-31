const Student = require("../models/Student");
const QRCode = require("qrcode");
exports.show = async (req, res) => {
  const student = await Student.findById(req.session.user.student);
  if (!student) return res.status(404).render("error", { title: "Student profile not found", message: "Your student profile could not be found." });
  const cardUrl = `${req.protocol}://${req.get("host")}/student/health-card`;
  const qrDataUrl = await QRCode.toDataURL(cardUrl, { width: 220, margin: 1, errorCorrectionLevel: "M", color: { dark: "#102a43", light: "#ffffff" } });
  res.render("student/health-card", { title: "Digital Student Health Card", student, qrDataUrl });
};
