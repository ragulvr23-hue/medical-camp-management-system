const mongoose = require("mongoose");
module.exports = async function connectDatabase() {
  return mongoose.connect(process.env.MONGODB_URI);
};
