import mongoose from "mongoose";

const assetSchema = new mongoose.Schema ({
        name: {
            type: String,
            required: [true, "Asset name is required"],
            trim: true,
            maxlength: [150, "Asset name must be at most 150 characters long"],
        },

        description: {
            type: String,
            required: [true, "Asset description is required"],
            trim: true,
            maxlength: [1000, "Asset description must be at most 1000 characters long"],
            default: 'No description provided'
        },

        category: {
            type: String,
            required: [true, "Asset category is required"],
            trim: true,
            maxlength: [50, "Asset category must be at most 50 characters long"],
        },

        serialNumber: {
            type: String,
            required: [true, "Asset serial number is required"],
            trim: true,
            unique: true,
            uppercase: true,
            maxlength: [100, "Asset serial number must be at most 100 characters long"],
        },

        status: {
            type: String,
            enum: ["available", "assigned", "maintenance", "retired", "stolen"],
            default: "active",
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
},

    {
        timestamps: true,
    }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;