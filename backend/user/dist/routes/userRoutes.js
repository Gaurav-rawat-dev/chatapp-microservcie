import { loginController } from "../controllers/user-controllers.js";
import express from "express";
const router = express.Router();
router.post("/login", loginController);
export default router;
