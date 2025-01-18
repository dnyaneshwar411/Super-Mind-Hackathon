import express from "express";
import {
  userLoginController,
  userLogoutController,
  userProfileController,
  userRegisterController
} from "../controllers/user.controller.js";
import { userLoggedInMiddleWare } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/auth/register", userRegisterController);
router.post("/login", userLoginController);
router.post("/logout", userLoggedInMiddleWare, userLogoutController);
router.get("/profile", userLoggedInMiddleWare, userProfileController);
// router.post("/forgot-password/send-otp", userForgotPasswordSendOTPController);
// router.post("/forgot-password/reset-password", userResetPasswordController);

export default router;