import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    provider_id: { type: String, required: true, ref: "ServiceProvider" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration_minutes: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
    availability_start: { type: String, required: true },
    availability_end: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema);
