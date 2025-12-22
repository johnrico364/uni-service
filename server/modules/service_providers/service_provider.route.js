import express from "express";
import upload from "../../middlewear/multer.js";
import {
  getAllProviders,
  registerProvider,
} from "./service_provider.controller.js";

const router = express.Router();

router.post("/register", registerProvider);
router.get("/", getAllProviders);

export default router;
