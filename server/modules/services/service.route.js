import express from "express";
import upload from "../../middlewear/multer.js";
import { registerService, getServices } from "./service.controller.js";

const router = express.Router();

router.post("/", upload.array("images", 6), registerService);
router.get("/", getServices);

export default router;
