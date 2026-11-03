import { jest } from '@jest/globals';
import { AppError } from '../../utils/errors.js';
import { agentLoginMiddleware } from '../agentMiddleware.js';

describe('agentLoginMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {};
    next = jest.fn();
  });

  test('should return 400 when email is missing', () => {
    req.body = {
      password: 'password123',
    };

    agentLoginMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid agent credentials',
      })
    );
  });

  test('should return 400 when password is missing', () => {
    req.body = {
      email: 'agent@example.com',
    };

    agentLoginMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid agent credentials',
      })
    );
  });

  test('should call next when email and password are provided', () => {
    req.body = {
      email: 'agent@example.com',
      password: 'password123',
    };

    agentLoginMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('should return 400 when request body is undefined', () => {
    req.body = undefined;

    agentLoginMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid agent credentials',
      })
    );
  });

  test('should return 500 when an unexpected error occurs', () => {
    Object.defineProperty(req, 'body', {
      get() {
        throw new Error('Unexpected error');
      },
    });

    agentLoginMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Agent login middleware failed',
      })
    );
  });
});