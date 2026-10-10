import express from "express";
import { getUsers, updateUser } from "../controllers/userController.js";
import { authenticate, authoriseRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get("/", authenticate, authoriseRoles("admin"), getUsers);

// @route   PUT /api/users/:id
// @desc    Update a user by ID
// @access  Private
router.patch("/:id", authenticate, authoriseRoles("admin"), updateUser);

export default router;