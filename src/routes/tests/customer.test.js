import { jest } from '@jest/globals';

const mockRequestLogger = jest.fn();
const mockCustomerSearchMiddleware = jest.fn();
const mockSearchCustomer = jest.fn();

jest.unstable_mockModule(
  '../../middleware/requestLogger.js',
  () => ({
    requestLogger: mockRequestLogger,
  })
);

jest.unstable_mockModule(
  '../../middleware/customerSearchMiddleware.js',
  () => ({
    customerSearchMiddleware: mockCustomerSearchMiddleware,
  })
);

jest.unstable_mockModule(
  '../../services/customerSearchService.js',
  () => ({
    searchCustomer: mockSearchCustomer,
  })
);

const { default: router } = await import('../customer.js');

describe('customer routes', () => {
  test('should export an Express router', () => {
    expect(typeof router).toBe('function');
    expect(router.stack).toBeDefined();
  });

  test('should register requestLogger middleware', () => {
    const middlewareLayer = router.stack.find(
      (layer) => layer.handle === mockRequestLogger
    );

    expect(middlewareLayer).toBeDefined();
  });

  test('should register GET / route', () => {
    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/'
    );

    expect(routeLayer).toBeDefined();
    expect(routeLayer.route.methods.get).toBe(true);

    const handlers = routeLayer.route.stack.map(
      (layer) => layer.handle
    );

    expect(handlers).toContain(mockCustomerSearchMiddleware);
  });

  test('should return 404 when no customers are found', async () => {
    mockSearchCustomer.mockResolvedValueOnce([]);

    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/'
    );

    const handler = routeLayer.route.stack[1].handle;

    const req = {
      query: {
        email: 'test@example.com',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await handler(req, res);

    expect(mockSearchCustomer).toHaveBeenCalledWith(
      'test@example.com'
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });

  test('should return customers when search succeeds', async () => {
    const customers = [
      {
        id: 'C123',
        email: 'test@example.com',
      },
    ];

    mockSearchCustomer.mockResolvedValueOnce(customers);

    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/'
    );

    const handler = routeLayer.route.stack[1].handle;

    const req = {
      query: {
        email: 'test@example.com',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await handler(req, res);

    expect(mockSearchCustomer).toHaveBeenCalledWith(
      'test@example.com'
    );

    expect(res.json).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(404);
  });
});