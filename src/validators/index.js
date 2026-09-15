import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errors.js';

export const handleValidationErrors = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, errors.array()[0].msg);
  }
  next();
};

export const validateUserCreation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').optional().isString().withMessage('Name must be a string'),
];

export const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateCaseUpdate = [
  body('caseId')
    .exists({ checkFalsy: true })
    .withMessage('caseId is required')
    .bail()
    .custom((value) => /^[A-Za-z0-9_-]{1,20}$/.test(String(value)))
    .withMessage('caseId must be a valid case identifier')
    .customSanitizer((value) => String(value)),
  body('contactChannel').optional().isString().withMessage('contactChannel must be a string'),
  body('customerNeed').optional().isString().withMessage('customerNeed must be a string'),
  body('employeeResponse').optional().isString().withMessage('employeeResponse must be a string'),
  body('orderNumber').optional().isString().withMessage('orderNumber must be a string'),
  body('notes').optional().isString().withMessage('notes must be a string'),
  body('isEscalated').optional().isBoolean().withMessage('isEscalated must be a boolean').toBoolean(),
  body('isCompleted').optional().isBoolean().withMessage('isCompleted must be a boolean').toBoolean(),
  body('customerId').optional().isString().notEmpty().withMessage('customerId must be a non-empty string'),
  body('agentId').optional().isString().notEmpty().withMessage('agentId must be a non-empty string'),
];
