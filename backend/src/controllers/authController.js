import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createAndSendOtp, verifyOtp } from "../services/otpService.js";
import jwt from "jsonwebtoken";

//* REGISTER USER
export const registerUser = async (req, res, next) => {
    let user;

    try {
        const { fullName, email, phoneNumber, password } = req.body;

        //? Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "❌ An account with this email already exists...",
            });
        }

        //? Hash the password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        //? Create a new user
        user = await User.create({
            fullName,
            email,
            phoneNumber: phoneNumber || null, // Set to null if not provided
            passwordHash,
            role: "employee", // Default role
        })

        //? OTP Result
        const otpResult = await createAndSendOtp({
            userId: user._id,
            email: user.email,
            purpose: "registration",
        });

        //? Return the new user
        return res.status(201).json({
            success: true,
            message: "✅ User registered successfully...",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                otpExpiresAt: otpResult.expiresAt,
            },
        });

    } catch (error) {
        if (user?._id) {
            // If user was created but an error occurred later, delete the user
            await User.findByIdAndDelete(user._id);
        }
        next(error);
        // ! This helps in passing the error to the error handling middleware defined in app.js
    }
}

//* RESEND REGISTRATION OTP
export const resendRegistrationOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "❌ This account is already verified. Please log in.",
            });
        }

        const otpResult = await createAndSendOtp({
            userId: user._id,
            email: user.email,
            purpose: "registration",
        });

        return res.status(200).json({
            success: true,
            message: "✅ Registration OTP resent successfully. Please check your email.",
            data: {
                email: user.email,
                otpExpiresAt: otpResult.expiresAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

//* VERIFY OTP FOR REGISTRATION
export const verifyRegistrationOtp = async (req, res, next) => {
    try{
        const { email, otp } = req.body;

        //? Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        //? Verify the OTP
        const verificationResult = await verifyOtp({
            userId: user._id,
            purpose: "registration",
            otp,
        });

        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                message: verificationResult.message,
            });
        }

        //? Mark the user as verified
        user.isVerified = true;
        await user.save();

        //? Generate JWT token
        const token = jwt.sign(
            {
                sub: user._id.toString(),
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h",
            }
        );

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60, // 1 hour
        });

        return res.status(200).json({
            success: true,
            message: "✅ Registration OTP verified successfully. User is now verified.",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });

    } catch (error) {
        next(error);
    }
};

//* GET CURRENT USER
export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                isVerified: user.isVerified,
                isActive: user.isActive,
            }
        });
    } catch (error) {
        next(error);
    }
};

//* LOG IN USER
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //? Find the user by email
        const user = await User.findOne({ email }).select("+passwordHash");

        // ? Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        //? Check if the user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "❌ User is inactive. Please contact the admin.",
            });
        }

        //? Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "❌ User is not verified. Please verify your account.",
            });
        }

        //? Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "❌ Invalid email or password",
            });
        }

        const otpResult = await createAndSendOtp({
            userId: user._id,
            email: user.email,
            purpose: "login",
        });

        return res.status(200).json({
            success: true,
            message: "✅ Login OTP sent successfully. Please verify your account.",
            data: {
                email: user.email,
                otpExpiresAt: otpResult.expiresAt,
            }
        });
    } catch (error) {
        next(error);
    }
};

//* VERIFY OTP FOR LOGIN
export const verifyLoginOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        //? Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User account not found",
            });
        }

        //? Verify the OTP
        const verificationResult = await verifyOtp({
            userId: user._id,
            purpose: "login",
            otp,
        });

        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                message: verificationResult.message,
            });
        }

        //? Generate JWT token
        const token = jwt.sign (
            {
                sub: user._id.toString(),
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h",
            }
        );

        //? Set the token as a cookie
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60, // 1 hour
        });

        return res.status(200).json({
            success: true,
            message: "✅ Login OTP verified successfully. User is now logged in.",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        next(error);
    }
};

//* LOG OUT USER
export const logoutUser = async (req, res, next) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        success: true,
        message: "✅ User logged out successfully.",
    });
};

// * FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        const otpResult = await createAndSendOtp({
            userId: user._id,
            email: user.email,
            purpose: "passwordReset",
        });

        return res.status(200).json({
            success: true,
            message: "✅ Password reset OTP sent successfully. Please verify your account.",
            data: {
                email: user.email,
                otpExpiresAt: otpResult.expiresAt,
            },
        });

    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        const passwordIsValid =
            typeof newPassword === "string" && newPassword.length >= 8 &&
                /[A-Za-z]/.test(newPassword) &&
                /\d/.test(newPassword) &&
                /[^A-Za-z0-9]/.test(newPassword);

        if (!passwordIsValid) {
            return res.status(400).json({
                success: false,
                message: "❌ Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        const verificationResult = await verifyOtp({
            userId: user._id,
            purpose: "passwordReset",
            otp,
        });

        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                message: verificationResult.message,
            });
        }

        const salt = await bcrypt.genSalt(12);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "✅ Password reset successfully.",
        });

    } catch (error) {
        next(error);
    }
}