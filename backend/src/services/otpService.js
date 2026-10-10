import bcrypt from "bcryptjs";
import OtpVerification from "../models/OtpVerification.js";
import { generateOTP, getOTPexpiryDate } from "../utils/otp.js";
import { sendOtpEmail } from "./emailService.js";

export const createAndSendOtp = async ({ userId, purpose, email }) => {
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = getOTPexpiryDate();

    await OtpVerification.updateMany(
        {
            // Filter for existing OTPs for the same user and purpose that haven't been used
            userId,
            purpose,
            usedAt: null
        },

        {
            // Mark them as used
            usedAt: new Date()
        }
    );

    const otpRecord = await OtpVerification.create({
        userId,
        otpHash,
        purpose,
        expiresAt
    });

    try {
        await sendOtpEmail({
            recipient: email,
            otp,
            purpose
        });

    } catch (error) {
        console.error("❌ Error sending OTP email:", error);

        // Delete the OTP record
        await OtpVerification.findByIdAndDelete(otpRecord._id);
        throw new Error("❌ Failed to send OTP email. Please try again later.");
    }

    return {
        expiresAt,
        message: "✅ OTP sent successfully. Please check your email."
    };
}

export const verifyOtp = async ({ userId, purpose, otp }) => {
    const otpRecord = await OtpVerification.findOne({
        userId,
        purpose,
        usedAt: null,
        expiresAt: { $gt: new Date() } // Ensure the OTP hasn't expired
    }).select("+otpHash");

    if (!otpRecord) {
        return {
            success: false,
            message: "❌ No valid OTP found. It may have expired or already been used."
        };
    }

    const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5);
    if (otpRecord.attempts >= maxAttempts) {
        return {
            success: false,
            message: "❌ Maximum OTP verification attempts exceeded. Please request a new OTP."
        };
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValidOtp) {
        otpRecord.attempts += 1;
        await otpRecord.save();

        return {
            success: false,
            message: "❌ Invalid OTP. Please try again."
        };
    }

    otpRecord.usedAt = new Date();
    await otpRecord.save();

    return {
        success: true,
        message: "✅ OTP verified successfully."
    };
}