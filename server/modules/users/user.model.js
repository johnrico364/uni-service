import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profile_image: { type: String, required: false, default: "default.png" },
    role: {
      type: String,
      enum: ["super_admin", "admin", "user", "service_provider"],
      required: true,
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      required: true,
      default: "inactive",
    },
    last_login: { type: Date, required: false },

    // Ban management fields
    ban_until: { type: Date, default: null },
    ban_reason: { type: String, default: null },

    // Soft delete fields
    is_deleted: { type: Boolean, default: false, index: true },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
