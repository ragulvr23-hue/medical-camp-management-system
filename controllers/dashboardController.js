const Student = require("../models/Student");
const MedicalCamp = require("../models/MedicalCamp");
const Appointment = require("../models/Appointment");
const HealthRecord = require("../models/HealthRecord");
const Notification = require("../models/Notification");
const InventoryItem = require("../models/InventoryItem");

exports.admin = async (req, res) => {
  const now = new Date();
  const [students, camps, upcoming, appointments, completed, pending, records, recentStudents, recentAppointments, notifications, appointmentStatus, monthlyAppointments, lowStockItems] = await Promise.all([
    Student.countDocuments(), MedicalCamp.countDocuments(), MedicalCamp.countDocuments({ date: { $gte: now }, active: true }),
    Appointment.countDocuments(), Appointment.countDocuments({ status: "Completed" }), Appointment.countDocuments({ status: "Pending" }),
    HealthRecord.countDocuments(), Student.find().sort({ createdAt: -1 }).limit(5),
    Appointment.find().populate("student camp").sort({ createdAt: -1 }).limit(5),
    Notification.find().sort({ publishAt: -1 }).limit(5),
    Appointment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Appointment.aggregate([{ $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1) } } }, { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { "_id.year": 1, "_id.month": 1 } }]),
    InventoryItem.find({ $expr: { $lte: ["$quantity", "$reorderLevel"] } }).sort({ quantity: 1 }).limit(5)
  ]);
  res.render("admin/dashboard", { title: req.session.user.role === "doctor" ? "Doctor Dashboard" : "Admin Dashboard", stats: { students, camps, upcoming, appointments, completed, pending, records }, recentStudents, recentAppointments, notifications, appointmentStatus, monthlyAppointments, lowStockItems });
};
exports.student = async (req, res) => {
  const Student = require("../models/Student");
  const student = await Student.findById(req.session.user.student);
  const [appointments, notifications, healthRecords] = await Promise.all([
    Appointment.find({ student: student?._id }).populate("camp").sort({ createdAt: -1 }),
    Notification.find({ $or: [{ target: "All" }, { target: "Department", department: student?.department }] }).sort({ publishAt: -1 }).limit(10),
    student ? HealthRecord.find({ student: student._id }).sort({ visitDate: -1, createdAt: -1 }) : []
  ]);
  res.render("student/dashboard", { title: "Student Dashboard", student, appointments, notifications, healthRecords });
};
