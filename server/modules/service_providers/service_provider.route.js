import express from "express";
import upload from "../../middlewear/multer.js";
import {
  getAllProviders,
  getProviderById,
  registerProvider,
} from "./service_provider.controller.js";

const router = express.Router();

router.post("/register", registerProvider);
router.get("/", getAllProviders);
router.get("/:id", getProviderById);

export default router;
