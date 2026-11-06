import { jest } from '@jest/globals';

const mockUserRoutes = jest.fn();
const mockCustomerRoutes = jest.fn();
const mockPurchaseRoutes = jest.fn();
const mockCaseRoutes = jest.fn();
const mockCaseIDRoutes = jest.fn();
const mockFundRoutes = jest.fn();

jest.unstable_mockModule('../users.js', () => ({
  default: mockUserRoutes,
}));

jest.unstable_mockModule('../customer.js', () => ({
  default: mockCustomerRoutes,
}));

jest.unstable_mockModule('../purchase.js', () => ({
  default: mockPurchaseRoutes,
}));

jest.unstable_mockModule('../case.js', () => ({
  default: mockCaseRoutes,
}));

jest.unstable_mockModule('../caseforCaseIDGenerate.js', () => ({
  default: mockCaseIDRoutes,
}));

jest.unstable_mockModule('../fund.js', () => ({
  default: mockFundRoutes,
}));

const { default: router } = await import('../index.js');

describe('index routes', () => {
  test('should export an Express router', () => {
    expect(typeof router).toBe('function');
    expect(router.stack).toBeDefined();
  });

  test('should register /users route', () => {
    const layer = router.stack.find(
      (item) => item.regexp?.test('/users')
    );

    expect(layer).toBeDefined();
  });

  test('should register /customers route', () => {
    const layer = router.stack.find(
      (item) => item.regexp?.test('/customers')
    );

    expect(layer).toBeDefined();
  });

  test('should register /purchase route', () => {
    const layer = router.stack.find(
      (item) => item.regexp?.test('/purchase')
    );

    expect(layer).toBeDefined();
  });

  test('should register /cases route', () => {
    const layer = router.stack.find(
      (item) => item.regexp?.test('/cases')
    );

    expect(layer).toBeDefined();
  });

  test('should register /cases/id route', () => {
    const layer = router.stack.find(
      (item) => item.regexp?.test('/cases/id')
    );

    expect(layer).toBeDefined();
  });

  test('should register /funds route', () => {
    const layer = router.stack.find(
      (item) => item.regexp?.test('/funds')
    );

    expect(layer).toBeDefined();
  });
});