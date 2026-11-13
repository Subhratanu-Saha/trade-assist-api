import { jest } from '@jest/globals';
import { AppError } from '../../utils/errors.js';

const mockLoggerError = jest.fn();

jest.unstable_mockModule('../../config/index.js', () => ({
  logger: {
    error: mockLoggerError,
  },
}));

const { authenticate, authorize } = await import('../auth.js');

describe('auth middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {},
    };

    res = {};
    next = jest.fn();
  });

  describe('authenticate', () => {
    test('should call next when token is provided', () => {
      req.headers.authorization = 'Bearer valid-token';

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    test('should throw 401 when token is missing', () => {
      expect(() => authenticate(req, res, next)).toThrow(
        'Invalid or expired token'
      );

      expect(mockLoggerError).toHaveBeenCalledWith(
        'Authentication error:',
        expect.any(AppError)
      );
    });

    test('should throw 401 when authorization header is missing', () => {
      req.headers.authorization = undefined;

      expect(() => authenticate(req, res, next)).toThrow(
        'Invalid or expired token'
      );

      expect(mockLoggerError).toHaveBeenCalled();
    });

    test('should throw 401 when authorization header has no token', () => {
      req.headers.authorization = 'Bearer';

      expect(() => authenticate(req, res, next)).toThrow(
        'Invalid or expired token'
      );

      expect(mockLoggerError).toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    test('should throw 401 when user is not authenticated', () => {
      const middleware = authorize('admin');

      expect(() => middleware(req, res, next)).toThrow(
        'User not authenticated'
      );
    });

    test('should throw 403 when user role is not allowed', () => {
      req.user = {
        role: 'customer',
      };

      const middleware = authorize('admin');

      expect(() => middleware(req, res, next)).toThrow(
        'Insufficient permissions'
      );
    });

    test('should call next when user has allowed role', () => {
      req.user = {
        role: 'admin',
      };

      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    test('should allow any of the provided roles', () => {
      req.user = {
        role: 'agent',
      };

      const middleware = authorize('admin', 'agent');

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test('should reject user with empty role', () => {
      req.user = {
        role: '',
      };

      const middleware = authorize('admin');

      expect(() => middleware(req, res, next)).toThrow(
        'Insufficient permissions'
      );
    });
  });
});