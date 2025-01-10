const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastSeen: { type: Date, default: Date.now }, 
});



module.exports = mongoose.model("User", userSchema);
