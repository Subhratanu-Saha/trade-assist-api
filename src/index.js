import { createApp } from './app.js';
import { config, logger } from './config/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = createApp();

const startServer = async () => {
  try {
    // Connect to database only if DATABASE_URL is configured
    if (config.database.url) {
      await prisma.$connect();
      logger.info('Database connected successfully');
    } else {
      logger.info('Database connection skipped (DATABASE_URL not configured)');
    }

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`API available at http://localhost:${config.port}/api/${config.apiVersion}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  if (config.database.url) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  if (config.database.url) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

startServer();
