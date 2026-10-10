import { body } from "express-validator";

export const createAssetValidation = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Asset name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Asset name must be between 2 and 150 characters long'),

    body('description')
    .trim()
    .notEmpty()
    .withMessage('Asset description is required')
    .isLength({ min: 2, max: 1000 })
    .withMessage('Asset description must be between 2 and 1000 characters long'),

    body('category')
    .trim()
    .notEmpty()
    .withMessage('Asset category is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Asset category must be between 2 and 50 characters long'),

    body('serialNumber')
    .trim()
    .notEmpty()
    .withMessage('Asset serial number is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Asset serial number must be between 2 and 100 characters long'),

    body('status')
    .trim()
    .notEmpty()
    .withMessage('Asset status is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Asset status must be between 2 and 50 characters long'),

];