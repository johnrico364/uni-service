import express from "express";
import { startChat } from "./chat.controller.js";

const router = express.Router();

router.post("/start", startChat);
// router.get('/')
// router.get('/:id')
// router.patch('/:id/delete')

export default router;
