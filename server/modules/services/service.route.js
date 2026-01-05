import express from "express";
import upload from "../../middlewear/multer.js";
import {
  registerService,
  getServices,
  getServiceById,
  updateService,
  deleteServiceImage,
} from "./service.controller.js";

const router = express.Router();

router.post("/", upload.array("images", 6), registerService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.patch("/:id", upload.array("images", 6), updateService);
router.patch("/:id/delete-image", deleteServiceImage);
// router.patch("/:id/status");
// router.patch("/:id/delete");

export default router;
