import express from "express";
import upload from "../../middlewear/multer.js";
import {
  getAllProviders,
  getProviderById,
  registerProvider,
  updateProvider,
  verifyProvider,
  deleteProvider,
} from "./service_provider.controller.js";

const router = express.Router();

router.post("/register", registerProvider);
router.get("/", getAllProviders);
router.get("/:id", getProviderById);
router.patch("/:id", updateProvider);
router.patch("/:id/verify", verifyProvider); //admin
router.patch("/:id/delete", deleteProvider);

export default router;
