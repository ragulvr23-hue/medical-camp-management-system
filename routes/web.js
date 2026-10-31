const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false, message: "Too many attempts. Please try again after 15 minutes." });
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth, allowRoles } = require("../middleware/auth");
const auth = require("../controllers/authController");
const dashboard = require("../controllers/dashboardController");
const students = require("../controllers/studentController");
const camps = require("../controllers/campController");
const appointments = require("../controllers/appointmentController");
const records = require("../controllers/recordController");
const notifications = require("../controllers/notificationController");
const User = require("../models/User");
const Student = require("../models/Student");
const MedicalCamp = require("../models/MedicalCamp");
const Notification = require("../models/Notification");
const inventory = require("../controllers/inventoryController");
const auditTrail = require("../controllers/auditController");
const MedicalCampModel = require("../models/MedicalCamp");
const audit = require("../utils/audit");
const healthCard = require("../controllers/healthCardController");

const admin = [requireAuth, allowRoles("admin", "staff")];
const healthcare = [requireAuth, allowRoles("admin", "staff", "doctor")];
const adminOnly = [requireAuth, allowRoles("admin")];
router.get("/", asyncHandler(async (req,res) => res.render("home", { title: "Medical Camp & Student Health Records", camps: await MedicalCamp.find({ active:true, date:{$gte:new Date()} }).sort({date:1}).limit(3), notifications: await Notification.find().sort({publishAt:-1}).limit(3) })));
router.get("/about", (req,res) => res.render("about", {title:"About"}));
router.get("/contact", (req,res) => res.render("contact", {title:"Contact"}));
router.get("/login", auth.loginPage);
router.post("/login", authLimiter, asyncHandler(auth.login));
router.post("/logout", auth.logout);
router.get("/register", (req,res) => res.render("auth/register", {title:"Student Registration"}));
router.post("/register", authLimiter, asyncHandler(auth.studentRegister));
router.get("/admin", ...admin, asyncHandler(dashboard.admin));
router.get("/doctor", requireAuth, allowRoles("doctor"), asyncHandler(dashboard.admin));
router.get("/calendar", requireAuth, asyncHandler(async (req,res) => { const camps = await MedicalCampModel.find({ active: true }).sort({ date: 1 }).limit(300); res.render("calendar/index", { title: "Camp Calendar", camps }); }));
router.get("/inventory", ...healthcare, asyncHandler(inventory.index));
router.post("/inventory", ...admin, asyncHandler(inventory.create));
router.post("/inventory/:id/stock", ...admin, asyncHandler(inventory.stock));
router.get("/admin/audit", ...adminOnly, asyncHandler(auditTrail.index));
router.get("/student/dashboard", requireAuth, allowRoles("student"), asyncHandler(dashboard.student));
router.get("/student/health-card", requireAuth, allowRoles("student"), asyncHandler(healthCard.show));

router.get("/admin/doctors", ...adminOnly, asyncHandler(async (req,res) => {
  const doctors = await User.find({ role: "doctor" }).select("name email active createdAt").sort({ createdAt: -1 });
  res.render("admin/doctors", { title: "Doctor Accounts", doctors });
}));
router.post("/admin/doctors", ...adminOnly, asyncHandler(async (req,res) => {
  const bcrypt = require("bcryptjs");
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!name || !email || password.length < 8) {
    req.flash("error", "Enter a name, valid email, and password with at least 8 characters.");
    return res.redirect("/admin/doctors");
  }
  const exists = await User.findOne({ email });
  if (exists) {
    req.flash("error", "An account with this email already exists.");
    return res.redirect("/admin/doctors");
  }
  const doctor = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: "doctor" });
  await audit(req, "Created", "Doctor account", doctor._id, `Created doctor account for ${email}`);
  req.flash("success", "Doctor account created successfully.");
  res.redirect("/admin/doctors");
}));
router.get("/admin/students", ...admin, asyncHandler(students.index));
router.get("/admin/students/new", ...admin, students.createPage);
router.post("/admin/students", ...admin, asyncHandler(students.create));
router.get("/admin/students/:id/edit", ...admin, asyncHandler(students.editPage));
router.post("/admin/students/:id", ...admin, asyncHandler(students.update));
router.post("/admin/students/:id/delete", ...adminOnly, asyncHandler(students.remove));

router.get("/camps", requireAuth, asyncHandler(camps.index));
router.get("/camps/new", ...admin, camps.createPage);
router.post("/camps", ...admin, asyncHandler(camps.create));
router.get("/camps/:id/edit", ...admin, asyncHandler(camps.editPage));
router.post("/camps/:id", ...admin, asyncHandler(camps.update));
router.post("/camps/:id/deactivate", ...adminOnly, asyncHandler(camps.remove));

router.get("/appointments", requireAuth, asyncHandler(appointments.index));
router.get("/appointments/book", requireAuth, asyncHandler(appointments.bookPage));
router.post("/appointments", requireAuth, allowRoles("admin","staff","student"), asyncHandler(appointments.book));
router.post("/appointments/:id/status", requireAuth, asyncHandler(appointments.status));

router.get("/records", ...healthcare, asyncHandler(records.index));
router.get("/records/export.csv", ...healthcare, asyncHandler(records.exportCsv));
router.get("/records/:id/print", ...healthcare, asyncHandler(records.printRecord));
router.get("/records/new", ...healthcare, asyncHandler(records.createPage));
router.post("/records", ...healthcare, asyncHandler(records.create));
router.get("/notifications", requireAuth, asyncHandler(notifications.index));
router.post("/notifications", ...admin, asyncHandler(notifications.create));

router.get("/profile", requireAuth, asyncHandler(async (req,res) => {
  const student = req.session.user.role === "student" ? await Student.findById(req.session.user.student) : null;
  res.render("student/profile", {title:"Profile", student});
}));
module.exports = router;
