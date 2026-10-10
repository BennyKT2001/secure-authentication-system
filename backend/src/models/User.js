import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [2, "Full name must be at least 2 characters long"],
        maxlength: [100, "Full name must be at most 100 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please use a valid email address"
        ]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true,
        default: null,
        // match: [
        //     /^\+?[1-9]\d{1,14}$/, "Please use a valid phone number"
        // ]
    },
    passwordHash: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [100, "Password must be at most 100 characters long"],
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee",
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},{
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;