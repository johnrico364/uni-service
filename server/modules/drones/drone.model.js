import mongoose from "mongoose";

const droneSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    battery_level: { type: Number, required: true, min: 0, max: 100 },
    load_capacity_kg: { type: Number, required: true },
    status: {
      type: String,
      enum: ["idle", "delivering", "maintenance", "offline"],
      default: "idle",
    },
    current_lat: { type: Number },
    current_lng: { type: Number },
    last_maintenance: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Drone", droneSchema);
