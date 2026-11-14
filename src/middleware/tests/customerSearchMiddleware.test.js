import { jest } from '@jest/globals';
import { customerSearchMiddleware } from '../customerSearchMiddleware.js';

describe('customerSearchMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      query: {},
    };

    res = {};
    next = jest.fn();
  });

  test('should return 400 when email is missing', () => {
    customerSearchMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Email query parameter is required',
      })
    );
  });

  test('should return 400 when email is empty', () => {
    req.query.email = '';

    customerSearchMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Email query parameter is required',
      })
    );
  });

  test('should return 400 when email contains only whitespace', () => {
    req.query.email = '   ';

    customerSearchMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Email query parameter is required',
      })
    );
  });

  test('should return 400 when email format is invalid', () => {
    req.query.email = 'invalid-email';

    customerSearchMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid email format',
      })
    );
  });

  test('should trim email and call next for valid email', () => {
    req.query.email = '  test@example.com  ';

    customerSearchMiddleware(req, res, next);

    expect(req.query.email).toBe('test@example.com');
    expect(next).toHaveBeenCalledWith();
  });

  test('should return 500 when an unexpected error occurs', () => {
    Object.defineProperty(req, 'query', {
      get() {
        throw new Error('Unexpected error');
      },
    });

    customerSearchMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Customer search middleware failed',
      })
    );
  });
});