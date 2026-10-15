import express from "express";
import { createAsset, getAssets, getMyAssets, getAssetById, updateAsset, deleteAsset } from "../controllers/assetController.js";
import { authenticate, authoriseRoles } from "../middleware/authMiddleware.js";
import { createAssetValidation } from "../validators/assetValidator.js";
import { handleValidationErrors } from "../validators/authValidator.js";

const router = express.Router();

// @route   POST /api/assets
// @desc    Create a new asset
// @access  Private
router.post("/", authenticate, authoriseRoles("admin"), createAssetValidation, handleValidationErrors, createAsset);

// @route   GET /api/assets
// @desc    Get all assets
// @access  Private
router.get("/", authenticate, authoriseRoles("admin", "employee"), getAssets);

// @route   GET /api/assets/my-assets
// @desc    Get my assets
// @access  Private
router.get("/my-assets", authenticate, authoriseRoles("employee"), getMyAssets);

// @route   GET /api/assets/:id
// @desc    Get an asset by ID
// @access  Private
router.get("/:id", authenticate, authoriseRoles("admin", "employee"), getAssetById);

// @route   PUT /api/assets/:id
// @desc    Update an asset by ID
// @access  Private
router.patch("/:id", authenticate, authoriseRoles("admin"), updateAsset);

// @route   DELETE /api/assets/:id
// @desc    Delete an asset by ID
// @access  Private
router.delete("/:id", authenticate, authoriseRoles("admin"), deleteAsset);

export default router;