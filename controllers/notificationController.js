const Notification = require("../models/Notification");
const audit = require("../utils/audit");
exports.index = async (req, res) => res.render("notifications/index", { title: "Notifications", notifications: await Notification.find().sort({ publishAt: -1 }) });
exports.create = async (req, res) => {
  const notification = await Notification.create({ ...req.body, createdBy: req.session.user.id });
  await audit(req, "Published", "Notification", notification._id, `Published announcement: ${notification.title}`);
  req.flash("success", "Announcement published.");
  res.redirect("/notifications");
};
