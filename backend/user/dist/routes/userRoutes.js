import { loginController, myProfile, verifyOtpController } from "../controllers/user-controllers.js";
import express from "express";
const router = express.Router();
router.post("/login", loginController);
router.post("/verify-otp", verifyOtpController);
router.get("/myprofile", myProfile);
export default router;
