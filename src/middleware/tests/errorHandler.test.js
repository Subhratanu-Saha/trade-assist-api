import { jest } from '@jest/globals';
import { AppError } from '../../utils/errors.js';

const mockLoggerError = jest.fn();

jest.unstable_mockModule('../../config/index.js', () => ({
  logger: {
    error: mockLoggerError,
  },
}));

const { errorHandler, notFoundHandler } = await import('../errorHandler.js');

describe('errorHandler', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {};
    next = jest.fn();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  test('should handle AppError', () => {
    const error = new AppError(400, 'Bad request');

    errorHandler(error, req, res, next);

    expect(mockLoggerError).toHaveBeenCalledWith('Error: Bad request');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Bad request',
      })
    );
  });

  test('should handle Prisma known request error', () => {
    const error = new Error('Prisma error');
    error.name = 'PrismaClientKnownRequestError';

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Database error',
      })
    );
  });

  test('should handle generic error in development environment', () => {
    process.env.NODE_ENV = 'development';

    const error = new Error('Unexpected error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Internal server error',
      })
    );
  });

  test('should handle generic error in production environment', () => {
    process.env.NODE_ENV = 'production';

    const error = new Error('Sensitive error details');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Internal server error',
      })
    );
  });
});

describe('notFoundHandler', () => {
  test('should return 404 not found response', () => {
    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Not found',
      })
    );
  });
});