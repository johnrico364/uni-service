import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profile_image: { type: String, required: false },
    role: {
      type: String,
      enum: ["super_admin", "admin", "user", "service_provider"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned", "pending"],
      required: true,
    },
    last_login: { type: Date, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
