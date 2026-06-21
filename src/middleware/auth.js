import { AppError } from '../utils/errors.js';
import { logger } from '../config/index.js';

export const authenticate = (req, _res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'No authentication token provided');
    }

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    throw new AppError(401, 'Invalid or expired token');
  }
};

export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError(401, 'User not authenticated');
    }

    if (!roles.includes(req.user.role || '')) {
      throw new AppError(403, 'Insufficient permissions');
    }

    next();
  };
};
