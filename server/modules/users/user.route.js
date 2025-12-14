import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  signinUser,
} from "./user.controller.js";

const router = express.Router();

// auth routes
router.post("/signup", createUser);
router.post("/signin", signinUser);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
