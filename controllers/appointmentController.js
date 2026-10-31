const Appointment = require("../models/Appointment");
const MedicalCamp = require("../models/MedicalCamp");
const Student = require("../models/Student");
const audit = require("../utils/audit");

exports.index = async (req, res) => {
  const filter = req.session.user.role === "student" ? { student: req.session.user.student } : {};
  const appointments = await Appointment.find(filter).populate("student camp").sort({ createdAt: -1 });
  res.render("appointments/index", { title: "Appointments", appointments });
};
exports.bookPage = async (req, res) => {
  const [camps, student, students] = await Promise.all([
    MedicalCamp.find({ active: true, date: { $gte: new Date(new Date().setHours(0,0,0,0)) } }).sort({ date: 1 }),
    req.session.user.role === "student" ? Student.findById(req.session.user.student) : Promise.resolve(null),
    ["admin", "staff"].includes(req.session.user.role) ? Student.find().sort({ fullName: 1 }) : Promise.resolve([])
  ]);
  res.render("appointments/book", { title: "Book Appointment", camps, student, students });
};
exports.book = async (req, res) => {
  const studentId = req.session.user.role === "student" ? req.session.user.student : req.body.student;
  if (!studentId) { req.flash("error", "Select a student."); return res.redirect("/appointments/book"); }
  const camp = await MedicalCamp.findOne({ _id: req.body.camp, active: true });
  if (!camp) { req.flash("error", "Camp is unavailable."); return res.redirect("/appointments/book"); }
  const [duplicate, count] = await Promise.all([
    Appointment.findOne({ student: studentId, camp: camp._id }),
    Appointment.countDocuments({ camp: camp._id, status: { $ne: "Cancelled" } })
  ]);
  if (duplicate) { req.flash("error", "This student already has an appointment for this camp."); return res.redirect("/appointments/book"); }
  if (count >= camp.capacity) { req.flash("error", "This camp has reached its booking capacity."); return res.redirect("/appointments/book"); }
  try {
    await Appointment.create({ student: studentId, camp: camp._id, appointmentDate: camp.date, status: "Confirmed", notes: req.body.notes });
  } catch (e) {
    if (e.code === 11000) { req.flash("error", "Duplicate booking prevented."); return res.redirect("/appointments/book"); }
    throw e;
  }
  await audit(req, "Booked", "Appointment", "", `Student ${studentId} booked camp ${camp.name}`);
  req.flash("success", "Appointment booked and confirmed.");
  res.redirect("/appointments");
};
exports.status = async (req, res) => {
  const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).send("Invalid status");
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).send("Appointment not found");
  if (req.session.user.role === "student" && (appointment.student.toString() !== req.session.user.student || req.body.status !== "Cancelled")) return res.status(403).send("Forbidden");
  appointment.status = req.body.status;
  await appointment.save();
  await audit(req, `Set ${req.body.status}`, "Appointment", appointment._id, `Appointment status changed to ${req.body.status}`);
  req.flash("success", `Appointment ${req.body.status.toLowerCase()}.`);
  res.redirect("/appointments");
};
