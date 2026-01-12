import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Initialize Firebase Admin (must be imported before routes)
import "./config/firebase-admin.js";

// Import routes
import user from "./modules/users/user.route.js";
import service from "./modules/services/service.route.js";
import provider from "./modules/service_providers/service_provider.route.js";
import appointments from "./modules/appointments/appointment.route.js";

dotenv.config();
const app = express();
app.use(express.json());

// MongoDB Connection
const _dbURI = process.env.MONGO_DB_URI;
mongoose.connect(_dbURI).then(() => {
  console.log("Connected to Mongo DB");
});

// Image static folder
app.use("/images", express.static("images"));

// Routes
app.use("/api/users", user);
app.use("/api/providers", provider);
app.use("/api/services", service);
app.use("/api/appointments", appointments);

// Local Server
app.listen(process.env.PORT, () =>
  console.log(`Listening to port ${process.env.PORT}`)
);
