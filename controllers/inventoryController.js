const InventoryItem = require("../models/InventoryItem");
const audit = require("../utils/audit");

exports.index = async (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 80);
  const filter = q ? { $or: [{ name: new RegExp(escapeRegex(q), "i") }, { category: new RegExp(escapeRegex(q), "i") }, { batchNumber: new RegExp(escapeRegex(q), "i") }] } : {};
  const items = await InventoryItem.find(filter).sort({ expiryDate: 1, name: 1 }).limit(500);
  const now = new Date();
  const soon = new Date(); soon.setDate(soon.getDate() + 30);
  const lowStock = items.filter(i => i.quantity <= i.reorderLevel).length;
  const expiring = items.filter(i => i.expiryDate && i.expiryDate <= soon && i.expiryDate >= now).length;
  res.render("inventory/index", { title: "Medicine Inventory", items, q, lowStock, expiring });
};
exports.create = async (req, res) => {
  const item = await InventoryItem.create({
    name: String(req.body.name || "").trim(), category: String(req.body.category || "General").trim(),
    quantity: Number(req.body.quantity), unit: String(req.body.unit || "units").trim(),
    reorderLevel: Number(req.body.reorderLevel || 0), batchNumber: String(req.body.batchNumber || "").trim(),
    expiryDate: req.body.expiryDate || null, notes: String(req.body.notes || "").trim(), updatedBy: req.session.user.id
  });
  await audit(req, "Created", "Inventory item", item._id, `Added ${item.name}; quantity ${item.quantity} ${item.unit}`);
  req.flash("success", "Inventory item added."); res.redirect("/inventory");
};
exports.stock = async (req, res) => {
  const item = await InventoryItem.findById(req.params.id);
  if (!item) return res.status(404).render("error", { title: "Not found", message: "Inventory item not found." });
  const change = Number(req.body.change);
  if (!Number.isFinite(change) || !Number.isInteger(change) || item.quantity + change < 0) {
    req.flash("error", "Enter a valid stock change. Stock cannot become negative."); return res.redirect("/inventory");
  }
  item.quantity += change;
  item.updatedBy = req.session.user.id;
  await item.save();
  await audit(req, "Adjusted stock", "Inventory item", item._id, `${item.name}: change ${change}; new quantity ${item.quantity}`);
  req.flash("success", "Stock updated."); res.redirect("/inventory");
};
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
