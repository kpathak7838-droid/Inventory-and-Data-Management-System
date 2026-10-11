const mongoose = require("mongoose");
require("dotenv").config();

const connection = mongoose.connect(
  process.env.mongourl || "mongodb://127.0.0.1:27017/inventory_db"
);

module.exports = { connection };