import express from "express";
import { getUsers, getEmployees, updateUser, deleteUser } from "../controllers/userController.js";
import { authenticate, authoriseRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/users/employees
// @desc    Get all employees
// @access  Private
router.get("/employees", authenticate, authoriseRoles("admin"), getEmployees);

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get("/", authenticate, authoriseRoles("admin"), getUsers);

// @route   PUT /api/users/:id
// @desc    Update a user by ID
// @access  Private
router.patch("/:id", authenticate, authoriseRoles("admin"), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete a user by ID
// @access  Private
router.delete("/:id", authenticate, authoriseRoles("admin"), deleteUser);

export default router;