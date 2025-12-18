import express from "express";
import upload from "../../middlewear/multer.js";
import { registerProvider } from "./service_provider.controller.js";

const router = express.Router();

router.post('/register', registerProvider)

export default router;