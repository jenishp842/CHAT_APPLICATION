const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: { type: String },
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    // receiver: { type: mongoose.Types.ObjectId, ref: "User" },
    chat:{type : mongoose.Types.ObjectId,ref:"Chat"}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
