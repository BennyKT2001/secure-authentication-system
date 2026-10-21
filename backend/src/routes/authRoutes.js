import express from "express";
import { registerUser, loginUser, verifyRegistrationOtp, verifyLoginOtp, forgotPassword, resetPassword, getCurrentUser, logoutUser } from "../controllers/authController.js";
import { registerValidator, handleValidationErrors } from "../validators/authValidator.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidator, handleValidationErrors, registerUser);

// @route   POST /api/auth/verify-registration-otp
// @desc    Verify registration OTP
// @access  Public
router.post("/verify-otp", verifyRegistrationOtp);

// @route   GET /api/auth/current-user
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, getCurrentUser);

// @route   POST /api/auth/login
// @desc    Log in a user
// @access  Public
router.post("/login", loginUser);

// @route   POST /api/auth/verify-login-otp
// @desc    Verify login OTP
// @access  Public
router.post("/verify-login-otp", verifyLoginOtp);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post("/reset-password", resetPassword);

// @route   POST /api/auth/logout
// @desc    Log out a user
// @access  Private
router.post("/logout", authenticate, logoutUser);

export default router;