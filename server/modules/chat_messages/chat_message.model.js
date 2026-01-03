const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    chat_id: { type: String, required: true, ref: "Chat" },
    sender_id: { type: String, required: true, ref: "User" },
    receiver_id: { type: String, required: true, ref: "User" },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
