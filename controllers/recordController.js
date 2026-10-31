const HealthRecord = require("../models/HealthRecord");
const Student = require("../models/Student");
const audit = require("../utils/audit");
exports.index = async (req, res) => {
  const q = String(req.query.q || "").trim();
  const matchingStudents = q ? await Student.find({
    $or: [{ studentId: new RegExp(q, "i") }, { fullName: new RegExp(q, "i") }]
  }).select("_id") : [];
  const filter = q ? { student: { $in: matchingStudents.map(s => s._id) } } : {};
  const records = await HealthRecord.find(filter).populate("student").sort({ visitDate: -1 }).limit(200);
  res.render("records/index", { title: "Health Records", records, q });
};
exports.createPage = async (req, res) => res.render("records/form", { title: "Add Health Record", students: await Student.find().sort({ fullName: 1 }) });
exports.create = async (req, res) => {
  const record = await HealthRecord.create({ ...req.body, temperature: req.body.temperature || undefined, heightCm: req.body.heightCm || undefined, weightKg: req.body.weightKg || undefined });
  await audit(req, "Created", "Health record", record._id, `Created health record for student ${record.student}`);
  req.flash("success", "Health record saved.");
  res.redirect("/records");
};


// Excel-compatible CSV export. Only authorized healthcare/admin roles can access this route.
exports.exportCsv = async (req, res) => {
  const records = await HealthRecord.find().populate("student").sort({ visitDate: -1 }).limit(5000);
  const columns = ["Visit Date","Student Name","Student ID","Blood Group","Blood Pressure","Temperature C","Height cm","Weight kg","Allergies","Symptoms","Diagnosis","Treatment","Advice","Doctor"];
  const cell = (value) => { let text = String(value ?? "").replace(/[\r\n]+/g, " "); if (/^[=+\-@\t]/.test(text)) text = "'" + text; return `"${text.replace(/"/g, '""')}"`; };
  const lines = [columns.map(cell).join(",")];
  records.forEach(r => lines.push([
    r.visitDate ? new Date(r.visitDate).toISOString().slice(0,10) : "",
    r.student?.fullName, r.student?.studentId, r.bloodGroup, r.bloodPressure,
    r.temperature, r.heightCm, r.weightKg, r.allergies, r.symptoms, r.diagnosis,
    r.treatment, r.advice, r.doctor
  ].map(cell).join(",")));
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="medicamp-health-records.csv"');
  res.send("\uFEFF" + lines.join("\r\n"));
};

exports.printRecord = async (req, res) => {
  const record = await HealthRecord.findById(req.params.id).populate("student");
  if (!record) return res.status(404).render("error", { title: "Record not found", message: "The requested health record was not found." });
  res.render("records/print", { title: "Health Record", record, layout: false });
};
