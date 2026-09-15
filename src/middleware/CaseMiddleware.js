import { AppError } from '../utils/errors.js';

export const caseMiddleware = (req, res, next) => {
  try {
    // Retrieve Case API
    if (req.path === '/retrieve') {
      const { caseId } = req.query;

      if (!caseId || !String(caseId).trim()) {
        return next(
          new AppError(400, 'caseId is required')
        );
      }

      req.query.caseId = String(caseId).trim();
      return next();
    }

    // Update Case API
    if (
      req.method === 'POST' &&
      (!req.body || typeof req.body !== 'object')
    ) {
      return next(
        new AppError(400, 'Request body is required')
      );
    }

    // List Case API
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