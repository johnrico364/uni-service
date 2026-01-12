import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Firebase Authentication Link
    firebaseUid: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    
    // User Information
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    profile_image: { type: String, required: false, default: "default.png" },
    
    // Note: password field removed - authentication handled by Firebase
    
    // Role and Status
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
      default: "active", // Changed default to active since Firebase handles auth
    },
    last_login: { type: Date, required: false },

    // Ban management fields
    ban_until: { type: Date, default: null },
    ban_reason: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);