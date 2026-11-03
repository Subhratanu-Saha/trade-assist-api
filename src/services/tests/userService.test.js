import { jest, describe, test, expect, beforeEach } from "@jest/globals";

// Mock Prisma
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockFindMany = jest.fn();

jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
      findMany: mockFindMany,
    },
  })),
}));

// Import after mocking Prisma
const { userService } = await import("../userService.js");

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // findUserByEmail
  describe("findUserByEmail", () => {
    test("should return a user when email exists", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
      };

      mockFindUnique.mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail(
        "test@example.com"
      );

      expect(result).toEqual(mockUser);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    test("should return null when user does not exist", async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await userService.findUserByEmail(
        "unknown@example.com"
      );

      expect(result).toBeNull();
    });
  });

  // createUser
  describe("createUser", () => {
    test("should create a new user successfully", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
      };

      mockCreate.mockResolvedValue(mockUser);

      const result = await userService.createUser(
        "test@example.com",
        "hashedPassword",
        "Test User"
      );

      expect(result).toEqual(mockUser);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          password: "hashedPassword",
          name: "Test User",
        },
      });
    });
  });

  // getUserById
  describe("getUserById", () => {
    test("should return a user when ID exists", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
      };

      mockFindUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("should return null when user ID does not exist", async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
    });
  });

  // getAllUsers
  describe("getAllUsers", () => {
    test("should return all users with default pagination", async () => {
      const mockUsers = [
        { id: 1, email: "user1@example.com" },
        { id: 2, email: "user2@example.com" },
      ];

      mockFindMany.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockFindMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });

    test("should return users with custom pagination", async () => {
      const mockUsers = [
        { id: 3, email: "user3@example.com" },
      ];

      mockFindMany.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers(2, 5);

      expect(result).toEqual(mockUsers);
      expect(mockFindMany).toHaveBeenCalledWith({
        skip: 2,
        take: 5,
      });
    });

    test("should return an empty array when no users exist", async () => {
      mockFindMany.mockResolvedValue([]);

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });
  });
});
