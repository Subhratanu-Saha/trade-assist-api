import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(email, password, name) {
    return prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async getUserById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUsers(skip = 0, take = 10) {
    return prisma.user.findMany({
      skip,
      take,
    });
  }
}

export const userService = new UserService();
