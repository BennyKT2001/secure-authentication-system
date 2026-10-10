import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    otpHash: {
        type: String,
        required: true,
        select: false,
    },
    purpose: {
        type: String,
        enum: ["registration", "login", "passwordReset"],
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // This will automatically delete the document after the specified time
    },
    attempts: {
        type: Number,
        default: 0,
        min: 0,
    },
    usedAt: {
        type: Date,
        default: null,
    },
},
    {
        timestamps: true,
    }
);

const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);

export default OtpVerification;