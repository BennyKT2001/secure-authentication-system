import express from "express";
import { getAuditLogs } from "../controllers/auditLogController.js";
import {
    authenticate,
    authoriseRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/audit-logs
// @desc    Get recent audit logs
// @access  Private/Admin
router.get(
    "/",
    authenticate,
    authoriseRoles("admin"),
    getAuditLogs,
);

export default router;
