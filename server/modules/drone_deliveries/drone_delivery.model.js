import mongoose from "mongoose";

const droneDeliverySchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, ref: "Order" },
    drone_id: { type: String, required: true, ref: "Drone" },
    pickup_address: { type: String, required: true },
    pickup_lat: { type: Number, required: true },
    pickup_lng: { type: Number, required: true },
    dropoff_address: { type: String, required: true },
    dropoff_lat: { type: Number, required: true },
    dropoff_lng: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "enroute_pickup",
        "enroute_dropoff",
        "delivered",
        "failed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DroneDelivery", droneDeliverySchema);
