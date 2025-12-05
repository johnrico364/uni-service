const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer_id: { type: String, required: true, ref: "User" },
    seller_id: { type: String, required: true, ref: "User" },
    total_amount: { type: Number, required: true },
    qr_code: { type: String, required: true },
    delivery_address: { type: String, required: true },
    delivery_lat: { type: Number },
    delivery_lng: { type: Number },
    status: {
      type: String,
      enum: ["pending", "processing", "for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    payment_id: { type: String, ref: "Payment" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
