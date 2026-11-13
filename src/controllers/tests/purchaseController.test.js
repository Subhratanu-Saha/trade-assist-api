import { jest } from '@jest/globals';
import { AppError } from '../../utils/errors.js';

const mockGetPurchasesByCustomerId = jest.fn();

jest.unstable_mockModule('../../services/purchaseService.js', () => ({
  getPurchasesByCustomerId: mockGetPurchasesByCustomerId,
}));

const { getPurchasesByCustomerId } = await import(
  '../purchaseController.js'
);

describe('purchaseController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {
        customerId: 'customer123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe('getPurchasesByCustomerId', () => {
    test('should return purchases successfully', async () => {
      const purchases = [
        {
          purchaseId: 'purchase001',
          customerId: 'customer123',
          amount: 500,
        },
        {
          purchaseId: 'purchase002',
          customerId: 'customer123',
          amount: 750,
        },
      ];

      mockGetPurchasesByCustomerId.mockResolvedValue(purchases);

      await getPurchasesByCustomerId(req, res, next);

      expect(mockGetPurchasesByCustomerId).toHaveBeenCalledWith(
        'customer123'
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Purchases retrieved successfully',
          data: purchases,
        })
      );

      expect(next).not.toHaveBeenCalled();
    });

    test('should pass 404 error to next when purchases are null', async () => {
      mockGetPurchasesByCustomerId.mockResolvedValue(null);

      await getPurchasesByCustomerId(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: 'Purchase records not found',
        })
      );
    });

    test('should pass 404 error to next when purchases are undefined', async () => {
      mockGetPurchasesByCustomerId.mockResolvedValue(undefined);

      await getPurchasesByCustomerId(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: 'Purchase records not found',
        })
      );
    });

    test('should pass 404 error to next when purchases array is empty', async () => {
      mockGetPurchasesByCustomerId.mockResolvedValue([]);

      await getPurchasesByCustomerId(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: 'Purchase records not found',
        })
      );
    });

    test('should pass 500 error to next when service throws an unexpected error', async () => {
      mockGetPurchasesByCustomerId.mockRejectedValue(
        new Error('Database connection failed')
      );

      await getPurchasesByCustomerId(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Internal server error',
        })
      );
    });

    test('should pass existing AppError to next', async () => {
      const error = new AppError(403, 'Access denied');

      mockGetPurchasesByCustomerId.mockRejectedValue(error);

      await getPurchasesByCustomerId(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 403,
          message: 'Access denied',
        })
      );
    });
  });
});