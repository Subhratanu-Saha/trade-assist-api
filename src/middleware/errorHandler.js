
import { logger } from '../config/index.js';
import { ErrorResponse } from '../utils/responses.js';
import { AppError } from '../utils/errors.js';

export const errorHandler = (error, _req, res, _next) => {
  logger.error(`Error: ${error.message}`);

  // Handle custom application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      new ErrorResponse(error.message, error.message)
    );
  }

  // Handle Prisma database errors
  if (error.name === 'PrismaClientKnownRequestError') {

    // Duplicate unique field (customer ID or email)
    if (error.code === 'P2002') {
      return res.status(409).json(
        new ErrorResponse(
          'Conflict',
          'Customer with this unique field already exists'
        )
      );
    }

    // Foreign key constraint violation
    if (error.code === 'P2003') {
      return res.status(409).json(
        new ErrorResponse(
          'Database constraint violation',
          'Referenced record does not exist'
        )
      );
    }

    // Required record not found
    if (error.code === 'P2025') {
      return res.status(404).json(
        new ErrorResponse(
          'Not found',
          'Requested database record was not found'
        )
      );
    }

    // Other Prisma known request errors
    return res.status(400).json(
      new ErrorResponse(
        'Database error',
        'An error occurred while processing your request'
      )
    );
  }

  // Handle unexpected errors
  return res.status(500).json(
    new ErrorResponse(
      'Internal server error',
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message
    )
  );
};

export const notFoundHandler = (_req, res) => {
  return res.status(404).json(
    new ErrorResponse(
      'Not found',
      'The requested resource was not found'
    )
  );
};
