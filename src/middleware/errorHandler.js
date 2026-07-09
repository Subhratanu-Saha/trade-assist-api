import { AppError } from '../utils/errors.js';

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
