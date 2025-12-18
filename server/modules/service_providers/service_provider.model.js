import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, ref: "User" },
    business_name: { type: String, required: true },
    service_category: {
      type: String,
      required: true,
      enum: [
        "Home Services",
        'Health & Wellness',
        "Beauty & Personal Care",
        "Automotive Services",
        "Professional & Freelance Services",
        "Education & Tutoring",
        "Events & Entertainment",
        "Maintenance & Technical Services",
        "Pet Care",
        "Delivery & Logistics",
      ],
    },
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

export default mongoose.model("ServiceProvider", serviceProviderSchema);
