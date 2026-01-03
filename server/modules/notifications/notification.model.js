import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, ref: "User" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["appointment", "order", "delivery", "system"],
      required: true,
    },
    is_read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
