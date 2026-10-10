import express from "express";
import { getUsers } from "../controllers/userController.js";
import { authenticate, authoriseRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get("/", authenticate, authoriseRoles("admin"), getUsers);

export default router;