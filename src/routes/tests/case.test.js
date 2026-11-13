import { jest } from '@jest/globals';

const mockRequestLogger = jest.fn();
const mockCaseMiddleware = jest.fn();
const mockGetCasesByCustomerId = jest.fn();
const mockGetCaseById = jest.fn();
const mockUpdateCase = jest.fn();

jest.unstable_mockModule('../../middleware/requestLogger.js', () => ({
  requestLogger: mockRequestLogger,
}));

jest.unstable_mockModule('../../middleware/CaseMiddleware.js', () => ({
  caseMiddleware: mockCaseMiddleware,
}));

jest.unstable_mockModule('../../controllers/caseController.js', () => ({
  getCasesByCustomerId: mockGetCasesByCustomerId,
  getCaseById: mockGetCaseById,
  updateCase: mockUpdateCase,
}));

const { default: router } = await import('../case.js');

describe('case routes', () => {
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

  test('should register GET /list route', () => {
    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/list'
    );

    expect(routeLayer).toBeDefined();
    expect(routeLayer.route.methods.get).toBe(true);

    const handlers = routeLayer.route.stack.map(
      (layer) => layer.handle
    );

    expect(handlers).toContain(mockCaseMiddleware);
    expect(handlers).toContain(mockGetCasesByCustomerId);
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

    expect(handlers).toContain(mockCaseMiddleware);
    expect(handlers).toContain(mockGetCaseById);
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

    expect(handlers).toContain(mockCaseMiddleware);
    expect(handlers).toContain(mockUpdateCase);
  });
});