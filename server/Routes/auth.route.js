import Router from "express";
import {isAuthenticated} from "../middlewares/isAuthenticaed.js";
import {
    signUpController,
    verifySignUpOTPController,
    resendOTPController,
    loginController,
    logoutController,
    getMeController,
    forgetPasswordRequestController,
    verifyOTPController,
    resetPasswordController,
} from "../Controllers/auth.controller.js";

const router = Router();

// Sign up + email verification
router.post("/signup", signUpController);
router.post("/signup/verify-otp", verifySignUpOTPController);
router.post("/signup/resend-otp", resendOTPController);

// Login / Logout / Current user
router.post("/login", loginController);
router.post("/logout", isAuthenticated, logoutController);
router.get("/me", isAuthenticated, getMeController);

// Forget password flow (email based)
router.post("/forget-password", forgetPasswordRequestController);
router.post("/forget-password/verify-otp", verifyOTPController);
router.post("/forget-password/reset", resetPasswordController);

export default router;