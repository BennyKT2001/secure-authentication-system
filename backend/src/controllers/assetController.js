import Asset from "../models/Asset.js";

// * CREATE ASSET
export const createAsset = async (req, res, next) => {
    try {
        const {name, description, category, serialNumber, status} = req.body;

        if (!name || !description || !category || !serialNumber || !status) {
            return res.status(400).json({
                success: false,
                message: "❌ Missing required fields",
            });
        }

        // ? veriy an existing asset
        const existingAsset = await Asset.findOne({
            serialNumber: serialNumber.toUpperCase()
        });

        if (existingAsset) {
            return res.status(409).json({
                success: false,
                message: "❌ An asset with this serial number already exists",
            });
        }

        // ? Create a New Asset
        const asset = await Asset.create({
            name,
            description,
            category,
            serialNumber: serialNumber.toUpperCase(),
            status,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "✅ Asset created successfully",
            data: asset,
        });

    } catch (error) {
        next(error);
    }
};

// * GET ALL ASSETS
export const getAssets = async (req, res, next) => {
    try {
        const assets = await Asset.find()
        .populate("createdBy", "fullName email")
        .populate("assignedTo", "fullName email")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "✅ Assets fetched successfully",
            count: assets.length,
            data: assets,
        });

    } catch (error) {

    }
};

// * GET ASSET BY ID
export const getAssetById = async (req, res, next) => {
    try {
        const asset = await Asset.findById(req.params.id)
        .populate("createdBy", "fullName email")
        .populate("assignedTo", "fullName email");

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "❌ Asset not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "✅ Asset fetched successfully",
            data: asset
        });

    } catch (error) {
        next(error);
    }
};

// * UPDATE ASSET
export const updateAsset = async (req, res, next) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "category",
            "serialNumber",
            "status",
            "assignedTo"
        ];

        const updates = {};

        // ? Update only allowed fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        // ? Update Serial Number
        if (updates.serialNumber) {
            updates.serialNumber = updates.serialNumber.toUpperCase();
        }

        const asset = await Asset.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        )
        .populate("createdBy", "fullName email")
        .populate("assignedTo", "fullName email");

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "❌ Asset not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "✅ Asset updated successfully",
            data: asset
        });

    } catch (error) {
        next(error);
    }
};

// *
export const deleteAsset = async (req, res, next) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);

        // ? Check if asset exists
        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "❌ Asset not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "✅ Asset deleted successfully",
            data: asset
        });

    } catch (error) {

    }
}