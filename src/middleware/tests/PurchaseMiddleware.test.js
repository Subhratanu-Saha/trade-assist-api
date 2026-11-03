import { jest } from '@jest/globals';

import { purchaseMiddleware } from '../PurchaseMiddleware.js';

describe('purchaseMiddleware', () => {
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  test('should return 400 when customerId is missing', () => {
    const req = {
      query: {},
    };

    purchaseMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'customerId is required',
      })
    );
  });

  test('should return 400 when customerId is empty', () => {
    const req = {
      query: {
        customerId: '',
      },
    };

    purchaseMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'customerId is required',
      })
    );
  });

  test('should call next when customerId is present', () => {
    const req = {
      query: {
        customerId: 'C123',
      },
    };

    purchaseMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  test('should handle errors and return 500', () => {
    const req = {
      query: {
        get customerId() {
          throw new Error('Unexpected error');
        },
      },
    };

    purchaseMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Purchase middleware failed',
      })
    );
  });
});