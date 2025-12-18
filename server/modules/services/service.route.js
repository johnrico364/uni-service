import express from "express";
import upload from "../../middlewear/multer.js";
import { registerService } from "./service.controller.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerService);

export default router;
