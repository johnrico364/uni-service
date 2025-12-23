import express from "express";
import upload from "../../middlewear/multer.js";
import {
  getAllProviders,
  getProviderById,
  registerProvider,
  updateProvider,
} from "./service_provider.controller.js";

const router = express.Router();

router.post("/register", registerProvider);
router.get("/", getAllProviders);
router.get("/:id", getProviderById);
router.patch("/:id", updateProvider);

export default router;
