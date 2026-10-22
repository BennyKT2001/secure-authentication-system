import Asset from "../models/Asset.js";
import User from "../models/User.js";
import { createAuditLog } from "../utils/auditLogger.js"

// * CREATE ASSET
export const createAsset = async (req, res, next) => {
    try {
        const {name, description, category, serialNumber, status, assignedTo} = req.body;

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

        // ? Verify assignedTo
        let validAssignedTo = null;
        if (assignedTo) {
            const employee = await User.findOne({
                _id: assignedTo,
                role: "employee",
                isActive: true,
            });
            if (!employee) {
                return res.status(400).json({
                    success: false,
                    message: "❌ The selected user is not an active employee.",
                });
            }
            validAssignedTo = employee._id;
        }

        // ? Create a New Asset
        const asset = await Asset.create({
            name,
            description,
            category,
            serialNumber: serialNumber.toUpperCase(),
            status: validAssignedTo ? "assigned" : "available",
            assignedTo: validAssignedTo,
            createdBy: req.user.id,
        });

        await createAuditLog({
            action: validAssignedTo
                ? "ASSET_ASSIGNED_ON_CREATE"
                : "ASSET_CREATED",
            entityType: "Asset",
            entityId: asset._id,
            performedBy: req.user.id,
            description: validAssignedTo
                ? `Asset "${asset.name}" was created and assigned.`
                : `Asset "${asset.name}" was created.`,
            metadata: {
                serialNumber: asset.serialNumber,
                assignedTo: validAssignedTo,
            },
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
        next(error);
    }
};

// * GET MY ASSETS
export const getMyAssets = async (req, res, next) => {
    try{
        const assets = await Asset.find({assignedTo: req.user.id,})
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
        next(error);
    }
}

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
            "assignedTo",
        ];

        const updates = {};

        // ? Update only allowed fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        // ? Validate assigned employee
        if (updates.assignedTo !== undefined) {
            if (updates.assignedTo === null || updates.assignedTo === "") {
                updates.assignedTo = null;
            } else {
                const employee = await User.findOne({
                    _id: updates.assignedTo,
                    role: "employee",
                    isActive: true,
                });

                if (!employee) {
                    return res.status(400).json({
                        success: false,
                        message: "❌ The selected user is not an active employee.",
                    });
                }

                updates.assignedTo = employee._id;
            }
        }

        // ? Synchronise asset status with assignment
        if (
            updates.assignedTo !== undefined &&
            updates.status === undefined
        ) {
            updates.status = updates.assignedTo
                ? "assigned"
                : "available";
        }

        // ? Update Serial Number
        if (updates.serialNumber) {
            updates.serialNumber = updates.serialNumber.toUpperCase();
        }

        const existingAsset = await Asset.findById(req.params.id);

        if (!existingAsset) {
            return res.status(404).json({
                success: false,
                message: "❌ Asset not found",
            });
        }

        const previousAssignedTo = existingAsset.assignedTo
            ? existingAsset.assignedTo.toString()
            : null;

        const asset = await Asset.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true,
            },
        )
            .populate("createdBy", "fullName email")
            .populate("assignedTo", "fullName email");

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "❌ Asset not found",
            });
        }

        const currentAssignedTo = asset.assignedTo
            ? asset.assignedTo._id.toString()
            : null;

        let auditAction = "ASSET_UPDATED";
        let auditDescription = `Asset "${asset.name}" was updated.`;

        if (
            updates.assignedTo !== undefined &&
            previousAssignedTo !== currentAssignedTo
        ) {
            if (currentAssignedTo) {
                auditAction = "ASSET_ASSIGNED";
                auditDescription = `Asset "${asset.name}" was assigned to an employee.`;
            } else {
                auditAction = "ASSET_UNASSIGNED";
                auditDescription = `Asset "${asset.name}" was unassigned.`;
            }
        }

        await createAuditLog({
            action: auditAction,
            entityType: "Asset",
            entityId: asset._id,
            performedBy: req.user.id,
            description: auditDescription,
            metadata: {
                previousAssignedTo,
                currentAssignedTo,
                status: asset.status,
            },
        });

        return res.status(200).json({
            success: true,
            message: "✅ Asset updated successfully",
            data: asset,
        });
    } catch (error) {
        next(error);
    }
};

// * Delete Asset
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

        await createAuditLog({
            action: "ASSET_DELETED",
            entityType: "Asset",
            entityId: asset._id,
            performedBy: req.user.id,
            description: `Asset "${asset.name}" was deleted.`,
            metadata: {
                serialNumber: asset.serialNumber,
            },
        });

        return res.status(200).json({
            success: true,
            message: "✅ Asset deleted successfully",
            data: asset
        });

    } catch (error) {
        next(error)
    }
}