const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, ref: "User" },
    business_name: { type: String, required: true },
    service_category: { type: String, required: true },
    description: { type: String, required: true },
    verification_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
