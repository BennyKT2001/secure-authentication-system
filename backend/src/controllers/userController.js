import User from "../models/User.js";

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

        return res.status(200).json({
            success: true,
            message: "✅ User updated successfully",
            data: user,
        });

    } catch (error) {

    }
};