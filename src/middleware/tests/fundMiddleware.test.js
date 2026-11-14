import { jest } from '@jest/globals';

import {
  fundMiddleware,
  fundRetrieveMiddleware,
  fundUpdateMiddleware,
} from '../fundMiddleware.js';

describe('fundMiddleware', () => {
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  test('should return 400 when customerId is missing', () => {
    const req = { query: {} };

    fundMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'customerId is required',
      })
    );
  });

  test('should return 400 when customerId is empty', () => {
    const req = { query: { customerId: '   ' } };

    fundMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'customerId is required',
      })
    );
  });

  test('should trim customerId and call next', () => {
    const req = { query: { customerId: '  C123  ' } };

    fundMiddleware(req, {}, next);

    expect(req.query.customerId).toBe('C123');
    expect(next).toHaveBeenCalledWith();
  });

  test('should convert customerId to string and call next', () => {
    const req = { query: { customerId: 123 } };

    fundMiddleware(req, {}, next);

    expect(req.query.customerId).toBe('123');
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

    fundMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Fund middleware failed',
      })
    );
  });
});

describe('fundRetrieveMiddleware', () => {
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  test('should return 400 when fundId is missing', () => {
    const req = { query: {} };

    fundRetrieveMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'fundId is required',
      })
    );
  });

  test('should return 400 when fundId is empty', () => {
    const req = { query: { fundId: '   ' } };

    fundRetrieveMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'fundId is required',
      })
    );
  });

  test('should trim fundId and call next', () => {
    const req = { query: { fundId: '  F123  ' } };

    fundRetrieveMiddleware(req, {}, next);

    expect(req.query.fundId).toBe('F123');
    expect(next).toHaveBeenCalledWith();
  });

  test('should convert fundId to string and call next', () => {
    const req = { query: { fundId: 123 } };

    fundRetrieveMiddleware(req, {}, next);

    expect(req.query.fundId).toBe('123');
    expect(next).toHaveBeenCalledWith();
  });
});

describe('fundUpdateMiddleware', () => {
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  test('should return 400 when body is empty', () => {
    const req = { body: {} };

    fundUpdateMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'fundId, customerId and agentId are mandatory',
      })
    );
  });

  test('should return 400 when fundId is missing', () => {
    const req = {
      body: {
        customerId: 'C123',
        agentId: 'A123',
      },
    };

    fundUpdateMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'fundId, customerId and agentId are mandatory',
      })
    );
  });

  test('should return 400 when customerId is missing', () => {
    const req = {
      body: {
        fundId: 'F123',
        agentId: 'A123',
      },
    };

    fundUpdateMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'fundId, customerId and agentId are mandatory',
      })
    );
  });

  test('should return 400 when agentId is missing', () => {
    const req = {
      body: {
        fundId: 'F123',
        customerId: 'C123',
      },
    };

    fundUpdateMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'fundId, customerId and agentId are mandatory',
      })
    );
  });

  test('should call next when all required fields are present', () => {
    const req = {
      body: {
        fundId: 'F123',
        customerId: 'C123',
        agentId: 'A123',
      },
    };

    fundUpdateMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  test('should handle errors and return 500', () => {
    const req = {
      get body() {
        throw new Error('Unexpected error');
      },
    };

    fundUpdateMiddleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Fund update middleware failed',
      })
    );
  });
});