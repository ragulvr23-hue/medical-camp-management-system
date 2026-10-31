const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const audit = require("../utils/audit");

exports.index = async (req, res) => {
  const q = String(req.query.q || "").trim();
  const filter = q ? { $or: [{ studentId: new RegExp(q, "i") }, { fullName: new RegExp(q, "i") }, { department: new RegExp(q, "i") }] } : {};
  const students = await Student.find(filter).sort({ createdAt: -1 }).limit(200);
  res.render("admin/students", { title: "Students", students, q });
};
exports.createPage = (req, res) => res.render("admin/student-form", { title: "Add Student", student: null });
exports.create = async (req, res) => {
  const data = { ...req.body };
  delete data.password;
  const student = await Student.create(data);
  if (req.body.password) await User.create({ name: student.fullName, email: student.email, password: await bcrypt.hash(req.body.password, 12), role: "student", student: student._id });
  await audit(req, "Created", "Student", student._id, `Created student ${student.studentId}`);
  req.flash("success", "Student created successfully.");
  res.redirect("/admin/students");
};
exports.editPage = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).render("error", { title: "Not found", message: "Student not found." });
  res.render("admin/student-form", { title: "Edit Student", student });
};
exports.update = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!student) return res.status(404).send("Student not found");
  await audit(req, "Updated", "Student", student._id, `Updated student ${student.studentId}`);
  req.flash("success", "Student updated.");
  res.redirect("/admin/students");
};
exports.remove = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send("Student not found");
  await audit(req, "Deleted", "Student", student._id, `Deleted student ${student.studentId} and linked demo records`);
  await Promise.all([
    Student.findByIdAndDelete(student._id),
    User.deleteMany({ student: student._id }),
    require("../models/Appointment").deleteMany({ student: student._id }),
    require("../models/HealthRecord").deleteMany({ student: student._id })
  ]);
  req.flash("success", "Student and linked demo records deleted.");
  res.redirect("/admin/students");
};
