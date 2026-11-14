import { jest } from '@jest/globals';

const mockGetAllUsers = jest.fn();
const mockGetUserById = jest.fn();

jest.unstable_mockModule('../../services/userService.js', () => ({
  userService: {
    getAllUsers: mockGetAllUsers,
    getUserById: mockGetUserById,
  },
}));

const { getUsers, getUserById } = await import('../userController.js');

describe('userController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {},
    };

    res = {
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getUsers', () => {
    test('should return all users successfully', async () => {
      const users = [
        { id: 1, name: 'User One' },
        { id: 2, name: 'User Two' },
      ];

      mockGetAllUsers.mockResolvedValue(users);

      await getUsers(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(mockGetAllUsers).toHaveBeenCalledTimes(1);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Users retrieved successfully',
          data: users,
        })
      );

      expect(next).not.toHaveBeenCalled();
    });

    test('should pass service error to next', async () => {
      const error = new Error('Failed to retrieve users');

      mockGetAllUsers.mockRejectedValue(error);

      await getUsers(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    test('should return user successfully', async () => {
      const user = {
        id: 1,
        name: 'User One',
      };

      req.params.id = '1';

      mockGetUserById.mockResolvedValue(user);

      await getUserById(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(mockGetUserById).toHaveBeenCalledWith(1);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User retrieved successfully',
          data: user,
        })
      );

      expect(next).not.toHaveBeenCalled();
    });

    test('should pass service error to next', async () => {
      const error = new Error('User not found');

      req.params.id = '1';

      mockGetUserById.mockRejectedValue(error);

      await getUserById(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(next).toHaveBeenCalledWith(error);
    });

    test('should parse user id from string to integer', async () => {
      req.params.id = '123';

      mockGetUserById.mockResolvedValue({ id: 123 });

      await getUserById(req, res, next);

      await new Promise((resolve) => setImmediate(resolve));

      expect(mockGetUserById).toHaveBeenCalledWith(123);
    });
  });
});