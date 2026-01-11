import express from "express";
import { startChat, getChats } from "./chat.controller.js";

const router = express.Router();

router.post("/start", startChat);
router.get("/", getChats);
// router.get('/:id')
// router.patch('/:id/delete')

export default router;
