import express from "express";

const router = express.Router();

router.post("/login", adminLoginController);
router.post("/logout", adminLoggedInMiddleware, adminLogoutController);
router.get("/profile", adminLoggedInMiddleware, adminProfileController);
router.post("/forgot-password/send-otp", adminForgotPasswordSendOTPController);
router.post("/forgot-password/reset-password", adminResetPasswordController);

export default router;