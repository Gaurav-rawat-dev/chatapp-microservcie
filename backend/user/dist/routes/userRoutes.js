import { loginController, myProfile, updateNameController, verifyOtpController } from "../controllers/user-controllers.js";
import express from "express";
import { isAuth } from "../midllewares/isAuth.js";
const router = express.Router();
router.post("/login", loginController);
router.post("/verify-otp", verifyOtpController);
router.get("/myprofile", myProfile);
router.put("/updatename", isAuth, updateNameController);
export default router;
