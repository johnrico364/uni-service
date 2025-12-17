import express from "express";
import upload from "../../middlewear/multer.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  signinUser,
  updateUserById,
} from "./user.controller.js";

const router = express.Router();

// auth routes
router.post("/signup", upload.single("image"), createUser);
router.post("/signin", signinUser);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", upload.single("image"), updateUserById);

export default router;
