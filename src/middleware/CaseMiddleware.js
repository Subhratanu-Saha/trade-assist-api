import { AppError } from '../utils/errors.js';

export const caseMiddleware = (req, res, next) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return next(
        new AppError(400, 'customerId is required')
      );
    }

    next();
  } catch (error) {
    return next(
      new AppError(500, 'Case middleware failed')
    );
  }
};