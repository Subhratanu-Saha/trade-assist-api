import { jest } from '@jest/globals';

const mockGenerateCaseId = jest.fn();

jest.unstable_mockModule(
  '../../controllers/caseControllerCaseIDGenerate.js',
  () => ({
    default: {
      generateCaseId: mockGenerateCaseId,
    },
  })
);

const { default: router } = await import('../caseforCaseIDGenerate.js');

describe('caseforCaseIDGenerate routes', () => {
  test('should export an Express router', () => {
    expect(typeof router).toBe('function');
    expect(router.stack).toBeDefined();
  });

  test('should register GET /generate route', () => {
    const routeLayer = router.stack.find(
      (layer) => layer.route?.path === '/generate'
    );

    expect(routeLayer).toBeDefined();
    expect(routeLayer.route.methods.get).toBe(true);

    const handlers = routeLayer.route.stack.map(
      (layer) => layer.handle
    );

    expect(handlers).toContain(mockGenerateCaseId);
  });
});