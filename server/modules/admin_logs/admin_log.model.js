import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    admin_id: { type: String, required: true, ref: "User" },
    action: { type: String, required: true },
    details: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export default mongoose.model("AdminLog", adminLogSchema);
