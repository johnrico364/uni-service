import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller_id: { type: String, required: true, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, reuired: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
