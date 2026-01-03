import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  order_id: { type: String, required: true, ref: "Order" },
  product_id: { type: String, required: true, ref: "Product" },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: mongoose.Decimal128, required: true },
  subtotal: { type: mongoose.Decimal128, required: true },
});

export default mongoose.model("OrderItem", orderItemSchema);
