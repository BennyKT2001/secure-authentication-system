
import { body, validationResult } from 'express-validator';

export const registerValidator = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters long'),

    body('email')
        .trim()
        .toLowerCase()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please use a valid email address')
        .normalizeEmail(),

    body('phoneNumber')
        .optional({ values: 'falsy' })
        .trim()
        .isMobilePhone('any')
        .withMessage('Please use a valid phone number'),

    body('password')
        .trim()
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage(
            'Password must contain at least one letter, one number, and one special character'
        ),
];

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path ?? err.param,
                message: err.msg,
            })),
        });
    }

    next();
};

export const validateRegister = [
    ...registerValidator,
    handleValidationErrors,
];