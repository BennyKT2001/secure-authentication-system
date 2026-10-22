import User from "../models/User.js";
import { createAuditLog } from "../utils/auditLogger.js";

// * GET ALL USERS
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "✅ Users fetched successfully",
            count: users.length,
            data: users,
        });

    } catch (error) {
        next(error);
    }
};

export const getEmployees = async (req, res, next) => {
    try {
        const employees = await User.find({
            role: "employee",
            isActive: true,
        })
        .select("_id fullName email phoneNumber")
        .sort({ fullName: 1 });

        return res.status(200).json({
            success: true,
            message: "✅ Employees fetched successfully",
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        next(error);
    }
}

// * UPDATE USER
export const updateUser = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, role, isActive } = req.body;

        if (role !== undefined && !["admin", "employee"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "❌ Invalid user role.",
            });
        }

        if (isActive !== undefined && typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "❌ Invalid user status.",
            });
        }

        const updates = {};

        // ? Update only allowed fields
        if (fullName !== undefined) updates.fullName = fullName;
        if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
        if (role !== undefined) updates.role = role;
        if (isActive !== undefined) updates.isActive = isActive;

        const existingUser = await User.findById(req.params.id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        }).select("-passwordHash");

        // ? Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        await createAuditLog({
            action: "USER_UPDATED",
            entityType: "User",
            entityId: user._id,
            performedBy: req.user.id,
            description: `User "${user.fullName}" was updated.`,
            metadata: {
                updatedFields: Object.keys(updates),
                previousRole: existingUser.role,
                currentRole: user.role,
                previousIsActive: existingUser.isActive,
                currentIsActive: user.isActive,
            },
        });

        return res.status(200).json({
            success: true,
            message: "✅ User updated successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};

// * DELETE USER
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        // ? Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found",
            });
        }

        await createAuditLog({
            action: "USER_DELETED",
            entityType: "User",
            entityId: user._id,
            performedBy: req.user.id,
            description: `User "${user.fullName}" was deleted.`,
            metadata: {
                email: user.email,
                role: user.role,
            },
        });

        return res.status(200).json({
            success: true,
            message: "✅ User deleted successfully",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });

    } catch (error) {
        next(error);
    }
};