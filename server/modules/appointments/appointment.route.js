import express from "express";
import { createAppointment, getAppointments } from "./appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
// router.get("/:id");
// router.patch("/:id");
// router.patch("/:id/status");
// router.patch("/:id/delete");

export default router;
