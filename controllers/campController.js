const MedicalCamp = require("../models/MedicalCamp");
const audit = require("../utils/audit");
exports.index = async (req, res) => res.render("camps/index", { title: "Medical Camps", camps: await MedicalCamp.find().sort({ date: 1 }) });
exports.createPage = (req, res) => res.render("camps/form", { title: "Create Camp", camp: null });
exports.create = async (req, res) => {
  const camp = await MedicalCamp.create({ ...req.body, staff: String(req.body.staff || "").split(",").map(s => s.trim()).filter(Boolean) });
  await audit(req, "Created", "Medical camp", camp._id, `Created camp ${camp.name}`);
  req.flash("success", "Medical camp created.");
  res.redirect("/camps");
};
exports.editPage = async (req, res) => {
  const camp = await MedicalCamp.findById(req.params.id);
  if (!camp) return res.status(404).render("error", { title: "Not found", message: "Camp not found." });
  res.render("camps/form", { title: "Edit Camp", camp });
};
exports.update = async (req, res) => {
  const data = { ...req.body, staff: String(req.body.staff || "").split(",").map(s => s.trim()).filter(Boolean) };
  const camp = await MedicalCamp.findByIdAndUpdate(req.params.id, data, { runValidators: true, new: true });
  if (camp) await audit(req, "Updated", "Medical camp", camp._id, `Updated camp ${camp.name}`);
  req.flash("success", "Camp updated.");
  res.redirect("/camps");
};
exports.remove = async (req, res) => {
  const camp = await MedicalCamp.findByIdAndUpdate(req.params.id, { active: false });
  if (camp) await audit(req, "Deactivated", "Medical camp", camp._id, `Deactivated camp ${camp.name}`);
  req.flash("success", "Camp marked inactive.");
  res.redirect("/camps");
};
