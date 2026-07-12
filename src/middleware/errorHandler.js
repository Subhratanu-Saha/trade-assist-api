import { logger } from '../config/index.js';
import { ErrorResponse } from '../utils/responses.js';
import { AppError } from '../utils/errors.js';

export const errorHandler = (error, _req, res, _next) => {
  logger.error(`Error: ${error.message}`);

  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      new ErrorResponse(error.message, error.message)
    );
    return;
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    res.status(400).json(
      new ErrorResponse('Database error', 'An error occurred while processing your request')
    );
    return;
  }

  res.status(500).json(
    new ErrorResponse(
      'Internal server error',
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message
    )
  );
};

export const notFoundHandler = (_req, res) => {
  res.status(404).json(
    new ErrorResponse('Not found', 'The requested resource was not found')
  );
};
