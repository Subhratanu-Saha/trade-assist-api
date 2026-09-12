import { AppError } from '../utils/errors.js';

export const caseRetrieveMiddleware = (req, res, next) => {
  try {
    const { caseId } = req.query;

    if (!caseId || !String(caseId).trim()) {
      return next(
        new AppError(400, 'caseId is required')
      );
    }

    req.query.caseId = String(caseId).trim();

    next();
  } catch (error) {
    return next(
      new AppError(500, 'Case retrieve middleware failed')
    );
  }
};