import { jest } from '@jest/globals';

const mockRequestLogger = jest.fn();
const mockGetAgentAuth = jest.fn();
const mockLoginAgent = jest.fn();
const mockAgentLoginMiddleware = jest.fn();

jest.unstable_mockModule('../../middleware/requestLogger.js', () => ({
    requestLogger: mockRequestLogger,
}));

jest.unstable_mockModule('../../controllers/authController.js', () => ({
    getAgentAuth: mockGetAgentAuth,
    loginAgent: mockLoginAgent,
}));

jest.unstable_mockModule('../../middleware/agentMiddleware.js', () => ({
    agentLoginMiddleware: mockAgentLoginMiddleware,
}));

const { default: router } = await import('../login.js');

describe('Login Routes', () => {
    test('should register requestLogger middleware', () => {
        const loggerLayer = router.stack.find(
            (layer) => layer.handle === mockRequestLogger
        );

        expect(loggerLayer).toBeDefined();
    });

    test('should register GET / route with getAgentAuth', () => {
        const getRoute = router.stack.find(
            (layer) => layer.route?.path === '/'
                && layer.route.methods.get
        );

        expect(getRoute).toBeDefined();
        expect(getRoute.route.stack[0].handle).toBe(mockGetAgentAuth);
    });

    test('should register POST / route with agentLoginMiddleware and loginAgent', () => {
        const postRoute = router.stack.find(
            (layer) => layer.route?.path === '/'
                && layer.route.methods.post
        );

        expect(postRoute).toBeDefined();

        expect(postRoute.route.stack[0].handle).toBe(
            mockAgentLoginMiddleware
        );

        expect(postRoute.route.stack[1].handle).toBe(
            mockLoginAgent
        );
    });
});