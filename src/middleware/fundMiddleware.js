import { AppError } from '../utils/errors.js';

export const fundMiddleware = (req, res, next) => {
  try {
    const customerId = String(req.query.customerId || '').trim();

    if (!customerId) {
      return next(new AppError(400, 'customerId is required'));
    }

    req.query.customerId = customerId;
    next();
  } catch (error) {
    return next(new AppError(500, 'Fund middleware failed'));
  }
};