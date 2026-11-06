import { jest } from '@jest/globals';

const mockRequestLogger = jest.fn();
const mockPurchaseMiddleware = jest.fn();
const mockGetPurchasesByCustomerId = jest.fn();

jest.unstable_mockModule('../../middleware/requestLogger.js', () => ({
    requestLogger: mockRequestLogger,
}));

jest.unstable_mockModule('../../middleware/PurchaseMiddleware.js', () => ({
    purchaseMiddleware: mockPurchaseMiddleware,
}));

jest.unstable_mockModule('../../controllers/purchaseController.js', () => ({
    getPurchasesByCustomerId: mockGetPurchasesByCustomerId,
}));

const { default: router } = await import('../purchase.js');

describe('Purchase Routes', () => {
    test('should register requestLogger middleware', () => {
        const loggerLayer = router.stack.find(
            (layer) => layer.handle === mockRequestLogger
        );

        expect(loggerLayer).toBeDefined();
    });

    test('should register GET / route with purchaseMiddleware and getPurchasesByCustomerId', () => {
        const getRoute = router.stack.find(
            (layer) =>
                layer.route?.path === '/' &&
                layer.route.methods.get
        );

        expect(getRoute).toBeDefined();

        expect(getRoute.route.stack[0].handle).toBe(
            mockPurchaseMiddleware
        );

        expect(getRoute.route.stack[1].handle).toBe(
            mockGetPurchasesByCustomerId
        );
    });
});