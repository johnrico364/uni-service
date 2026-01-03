import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    service_id: { type: String, required: true, ref: "Service" },
    user_id: { type: String, required: true, ref: "User" },
    provider_id: { type: String, required: true, ref: "ServiceProvider" },
    schedule: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    payment_id: { type: String, ref: "Payment" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Appointment", appointmentSchema);
