const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    messages: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    isGroup: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
