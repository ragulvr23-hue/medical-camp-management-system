require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = "admin@medicamp.local";
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name: "Demo Administrator", email, password: await bcrypt.hash("Admin@12345", 12), role: "admin" });
    console.log("Demo admin created.");
  } else console.log("Demo admin already exists.");
  console.log("Login: admin@medicamp.local / Admin@12345");
  await mongoose.disconnect();
})().catch(err => { console.error(err); process.exit(1); });
