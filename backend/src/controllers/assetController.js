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
            createdBy: req.user._id,
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