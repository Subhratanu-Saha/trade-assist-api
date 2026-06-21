import { PrismaClient } from '@prisma/client';
import { logger } from '../config/index.js';

let prismaInstance = null;

export const getPrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    if (process.env.NODE_ENV === 'development') {
      prismaInstance.$on('query', (e) => {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    prismaInstance.$on('error', (e) => {
      logger.error('Prisma Error:', e);
    });
  }

  return prismaInstance;
};

export const disconnectPrisma = async () => {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
};

export default getPrismaClient();
