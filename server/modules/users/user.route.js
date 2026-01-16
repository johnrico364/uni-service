import express from "express";
import upload from "../../middlewear/multer.js";
import { authenticateFirebase, authorizeRoles } from "../../middlewear/firebase-auth.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  signinUser,
  updateUserById,
  updateUserStatusById,
  getCurrentUser,
} from "./user.controller.js";

const router = express.Router();

// Public routes (no authentication required)
// Note: Signup/Signin are now handled by Firebase Authentication
// These routes are kept for backward compatibility but are deprecated
router.post("/signup", upload.single("image"), createUser);
router.post("/signin", signinUser);

// Protected routes (require Firebase authentication)
// Get current authenticated user
router.get("/me", authenticateFirebase, getCurrentUser);

// Get all users (Admin only)
router.get("/", authenticateFirebase, authorizeRoles("admin", "super_admin"), getAllUsers);

// Get user by ID (Admin or the user themselves)
router.get("/:id", authenticateFirebase, getUserById);

// Update user by ID (Admin or the user themselves)
router.patch("/:id", authenticateFirebase, upload.single("image"), updateUserById);

// Update user status (Admin only)
router.put("/:id/status", authenticateFirebase, authorizeRoles("admin", "super_admin"), updateUserStatusById);

export default router;
