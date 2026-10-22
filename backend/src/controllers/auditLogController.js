import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
            .populate("performedBy", "fullName email role")
            .sort({ createdAt: -1 })
            .limit(200);

        return res.status(200).json({
            success: true,
            message: "✅ Audit logs fetched successfully",
            count: logs.length,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};
