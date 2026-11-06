import { jest } from '@jest/globals';
import { caseMiddleware } from '../CaseMiddleware.js';

describe('caseMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      path: '/',
      method: 'GET',
      query: {},
      body: {},
    };

    res = {};
    next = jest.fn();
  });

  describe('Retrieve Case API', () => {
    test('should return 400 when caseId is missing', () => {
      req.path = '/retrieve';

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'caseId is required',
        })
      );
    });

    test('should return 400 when caseId is empty', () => {
      req.path = '/retrieve';
      req.query.caseId = '   ';

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'caseId is required',
        })
      );
    });

    test('should trim caseId and call next', () => {
      req.path = '/retrieve';
      req.query.caseId = '  CASE123  ';

      caseMiddleware(req, res, next);

      expect(req.query.caseId).toBe('CASE123');
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Update Case API', () => {
    test('should return 400 when POST body is missing', () => {
      req.method = 'POST';
      req.body = undefined;

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Request body is required',
        })
      );
    });

    test('should return 400 when POST body is null', () => {
      req.method = 'POST';
      req.body = null;

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Request body is required',
        })
      );
    });

    test('should return 400 when POST body is not an object', () => {
      req.method = 'POST';
      req.body = 'invalid';

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Request body is required',
        })
      );
    });

    test('should call next when POST body is an object', () => {
      req.method = 'POST';
      req.body = {
        customerId: 'CUST123',
      };

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('List Case API', () => {
    test('should return 400 when GET customerId is missing', () => {
      req.method = 'GET';
      req.query = {};

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'customerId is required',
        })
      );
    });

    test('should call next when GET customerId is provided', () => {
      req.method = 'GET';
      req.query.customerId = 'CUST123';

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should call next for other methods', () => {
      req.method = 'DELETE';

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Error handling', () => {
    test('should return 500 when an unexpected error occurs', () => {
      req.path = '/retrieve';

      Object.defineProperty(req, 'query', {
        get() {
          throw new Error('Unexpected error');
        },
      });

      caseMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Case middleware failed',
        })
      );
    });
  });
});