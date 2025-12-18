import express from "express";
import upload from "../../middlewear/multer.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  signinUser,
  updateUserById,
  updateUserStatusById,
} from "./user.controller.js";

const router = express.Router();

// auth routes
router.post("/signup", upload.single("image"), createUser);
router.post("/signin", signinUser);

router.get("/", getAllUsers); // Admin only
router.get("/:id", getUserById); // Admin and user
router.patch("/:id", upload.single("image"), updateUserById); // Admin and user
router.put("/:id/status", updateUserStatusById);

export default router;
