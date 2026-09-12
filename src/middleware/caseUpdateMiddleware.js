import { body } from 'express-validator';
import { handleValidationErrors } from '../validators/index.js';

export const caseUpdateMiddleware = [
  body('caseId')
    .isString()
    .withMessage('caseId is required')
    .trim()
    .notEmpty()
    .withMessage('caseId is required'),
  body('name').optional().isString().withMessage('name must be a string').trim(),
  body('emailaddr').optional().isEmail().withMessage('emailaddr must be a valid email').normalizeEmail(),
  body('contactnum').optional({ nullable: true }).isString().withMessage('contactnum must be a string').trim(),
  body('dob').optional({ nullable: true }).isISO8601().withMessage('dob must be a valid date'),
  body('gender').optional({ nullable: true }).isString().isLength({ max: 1 }).withMessage('gender must be one character').trim(),
  body('address').optional({ nullable: true }).isString().withMessage('address must be a string').trim(),
  body('isactive').optional().isBoolean().withMessage('isactive must be a boolean').toBoolean(),
  handleValidationErrors,
];