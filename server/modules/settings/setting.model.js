const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    updated_by: { type: String, ref: "User" },
  },
  {
    timestamps: true,
  }
);
