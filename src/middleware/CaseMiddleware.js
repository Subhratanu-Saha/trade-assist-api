import { AppError } from '../utils/errors.js';

export const caseMiddleware = (req, res, next) => {
  try {
    const customerId = req.method === 'GET' ? req.query.customerId : req.body?.customerId;

    if (req.method === 'GET' && !customerId) {
      return next(
        new AppError(400, 'customerId is required')
      );
    }

    if (req.method === 'POST' && (!req.body || typeof req.body !== 'object')) {
      return next(new AppError(400, 'Request body is required'));
    }

    next();
  } catch (error) {
    return next(
      new AppError(500, 'Case middleware failed')
    );
  }
};