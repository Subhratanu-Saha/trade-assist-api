import { jest } from '@jest/globals';

const mockGetUsers = jest.fn();
const mockGetUserById = jest.fn();
const mockAsyncHandler = jest.fn((handler) => handler);

jest.unstable_mockModule('../../controllers/userController.js', () => ({
    getUsers: mockGetUsers,
    getUserById: mockGetUserById,
}));

jest.unstable_mockModule('../../utils/errors.js', () => ({
    asyncHandler: mockAsyncHandler,
}));

const { default: router } = await import('../users.js');

describe('User Routes', () => {
    test('should register GET / route with getUsers', () => {
        const getUsersRoute = router.stack.find(
            (layer) =>
                layer.route?.path === '/' &&
                layer.route.methods.get
        );

        expect(getUsersRoute).toBeDefined();
        expect(getUsersRoute.route.stack[0].handle).toBe(
            mockGetUsers
        );
    });

    test('should register GET /:id route with getUserById', () => {
        const getUserByIdRoute = router.stack.find(
            (layer) =>
                layer.route?.path === '/:id' &&
                layer.route.methods.get
        );

        expect(getUserByIdRoute).toBeDefined();
        expect(getUserByIdRoute.route.stack[0].handle).toBe(
            mockGetUserById
        );
    });

    test('should call asyncHandler for both controllers', () => {
        expect(mockAsyncHandler).toHaveBeenCalledTimes(2);
        expect(mockAsyncHandler).toHaveBeenNthCalledWith(
            1,
            mockGetUsers
        );
        expect(mockAsyncHandler).toHaveBeenNthCalledWith(
            2,
            mockGetUserById
        );
    });
});