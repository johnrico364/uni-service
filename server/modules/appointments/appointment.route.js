import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
} from "./appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.patch("/:id", updateAppointment);
// router.patch("/:id/status");
// router.patch("/:id/delete");

export default router;
