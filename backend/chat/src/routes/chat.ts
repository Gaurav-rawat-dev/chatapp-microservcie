import express from "express";
import { createChat } from "../controller/chat.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router()

router.post("/create-chat",isAuth, createChat)

export default router