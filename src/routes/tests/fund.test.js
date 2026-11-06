import { jest } from '@jest/globals';

const mockRequestLogger = jest.fn();
const mockFundMiddleware = jest.fn();
const mockFundUpdateMiddleware = jest.fn();
const mockFundRetrieveMiddleware = jest.fn();

const mockCreateFund = jest.fn();
const mockUpdateFund = jest.fn();
const mockGetFundsByCustomerId = jest.fn();
const mockGetFundById = jest.fn();

jest.unstable_mockModule(
  '../../middleware/requestLogger.js',
  () => ({
    requestLogger: mockRequestLogger,
  })
);

jest.unstable_mockModule(
  '../../middleware/fundMiddleware.js',
  () => ({
    fundMiddleware: mockFundMiddleware,
    fundUpdateMiddleware: mockFundUpdateMiddleware,
    fundRetrieveMiddleware: mockFundRetrieveMiddleware,
  })
);

jest.unstable_mockModule(
  '../../controllers/fundController.js',
  () => ({
    createFund: mockCreateFund,
    updateFund: mockUpdateFund,
    getFundsByCustomerId: mockGetFundsByCustomerId,
    getFundById: mockGetFundById,
  })
);

const { default: router } = await import('../fund.js');

describe('fund routes', () => {
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

  test('should register POST /create route', () => {
    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/create'
    );

    expect(routeLayer).toBeDefined();
    expect(routeLayer.route.methods.post).toBe(true);

    const handlers = routeLayer.route.stack.map(
      (layer) => layer.handle
    );

    expect(handlers).toContain(mockCreateFund);
  });

  test('should register GET /list route', () => {
    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/list'
    );

    expect(routeLayer).toBeDefined();
    expect(routeLayer.route.methods.get).toBe(true);

    const handlers = routeLayer.route.stack.map(
      (layer) => layer.handle
    );

    expect(handlers).toContain(mockFundMiddleware);
    expect(handlers).toContain(mockGetFundsByCustomerId);
  });

  test('should register GET /retrieve route', () => {
    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/retrieve'
    );

    expect(routeLayer).toBeDefined();
    expect(routeLayer.route.methods.get).toBe(true);

    const handlers = routeLayer.route.stack.map(
      (layer) => layer.handle
    );

    expect(handlers).toContain(mockFundRetrieveMiddleware);
    expect(handlers).toContain(mockGetFundById);
  });

  test('should register POST /update route', () => {
    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/update'
    );

    expect(routeLayer).toBeDefined();
    expect(routeLayer.route.methods.post).toBe(true);

    const handlers = routeLayer.route.stack.map(
      (layer) => layer.handle
    );

    expect(handlers).toContain(mockFundUpdateMiddleware);
    expect(handlers).toContain(mockUpdateFund);
  });
});