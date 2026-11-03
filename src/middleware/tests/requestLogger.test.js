import { jest } from '@jest/globals';

const mockHttp = jest.fn();

jest.unstable_mockModule('../../config/index.js', () => ({
  logger: {
    http: mockHttp,
  },
}));

const { requestLogger } = await import('../requestLogger.js');

describe('requestLogger', () => {
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  test('should log the HTTP request and call next', () => {
    const req = {
      method: 'GET',
      path: '/api/v1/customer',
      ip: '127.0.0.1',
    };

    requestLogger(req, {}, next);

    expect(mockHttp).toHaveBeenCalledWith(
      'GET /api/v1/customer - IP: 127.0.0.1'
    );

    expect(next).toHaveBeenCalledWith();
  });

  test('should log POST request details', () => {
    const req = {
      method: 'POST',
      path: '/api/v1/purchase',
      ip: '192.168.1.10',
    };

    requestLogger(req, {}, next);

    expect(mockHttp).toHaveBeenCalledWith(
      'POST /api/v1/purchase - IP: 192.168.1.10'
    );

    expect(next).toHaveBeenCalledWith();
  });
});