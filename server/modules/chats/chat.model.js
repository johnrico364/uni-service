import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, ref: "User" },
    partner_id: { type: String, required: true, ref: "User" },
    last_message: { type: String, default: "" },
    last_message_at: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);
