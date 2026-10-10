import User from "../models/User.js";

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