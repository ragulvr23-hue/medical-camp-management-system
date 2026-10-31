const router = require("express").Router();
const { requireAuth, allowRoles } = require("../middleware/auth");
const Student = require("../models/Student");
const MedicalCamp = require("../models/MedicalCamp");
const Appointment = require("../models/Appointment");
const HealthRecord = require("../models/HealthRecord");

router.use(requireAuth);
router.get("/students", allowRoles("admin","staff"), async (req,res) => res.json(await Student.find().limit(200)));
router.post("/students", allowRoles("admin","staff"), async (req,res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
});
router.get("/students/:id", allowRoles("admin","staff"), async (req,res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({error:"Student not found"});
  res.json(student);
});
router.put("/students/:id", allowRoles("admin","staff"), async (req,res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true});
  if (!student) return res.status(404).json({error:"Student not found"});
  res.json(student);
});
router.delete("/students/:id", allowRoles("admin"), async (req,res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
router.get("/camps", async (req,res) => res.json(await MedicalCamp.find({active:true}).sort({date:1})));
router.post("/camps", allowRoles("admin","staff"), async (req,res) => res.status(201).json(await MedicalCamp.create(req.body)));
router.get("/appointments", allowRoles("admin","staff"), async (req,res) => res.json(await Appointment.find().populate("student camp")));
router.get("/health-records/:studentId", allowRoles("admin","staff"), async (req,res) => {
  const student = await Student.findOne({studentId:req.params.studentId});
  if (!student) return res.status(404).json({error:"Student not found"});
  res.json(await HealthRecord.find({student:student._id}).sort({visitDate:-1}));
});
module.exports = router;
