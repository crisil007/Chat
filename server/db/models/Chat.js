const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Used for one-to-one chat
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Used for group chat
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isGroup: { type: Boolean, default: false } // Flag to distinguish group chat
});

module.exports = mongoose.model("Chat", chatSchema);
