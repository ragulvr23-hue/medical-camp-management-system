const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");

exports.loginPage = (req, res) => res.render("auth/login", { title: "Login" });
exports.login = async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  const user = await User.findOne({ email, active: true });
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }
  req.session.regenerate((err) => {
    if (err) return res.status(500).send("Unable to start session.");
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, student: user.student?.toString() || null };
    req.flash("success", `Welcome, ${user.name}.`);
    res.redirect(user.role === "student" ? "/student/dashboard" : user.role === "doctor" ? "/doctor" : "/admin");
  });
};
exports.logout = (req, res) => req.session.destroy(() => res.redirect("/"));
exports.studentRegister = async (req, res) => {
  const { studentId, fullName, age, gender, department, className, contact, email, guardianName, guardianContact, address, password } = req.body;
  const exists = await Student.findOne({ $or: [{ studentId }, { email: String(email).toLowerCase() }] });
  if (exists) {
    req.flash("error", "A student with this Student ID or email already exists.");
    return res.redirect("/register");
  }
  const student = await Student.create({ studentId, fullName, age, gender, department, className, contact, email, guardianName, guardianContact, address });
  try {
    const hash = await bcrypt.hash(password, 12);
    await User.create({ name: fullName, email, password: hash, role: "student", student: student._id });
  } catch (err) {
    await Student.findByIdAndDelete(student._id);
    if (err.code === 11000) {
      req.flash("error", "An account with this email already exists.");
      return res.redirect("/register");
    }
    throw err;
  }
  req.flash("success", "Registration completed. You can now log in.");
  res.redirect("/login");
};
