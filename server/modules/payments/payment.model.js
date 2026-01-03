import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, ref: "User" },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["GCash", "Cod"], required: true },
    reference_number: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
