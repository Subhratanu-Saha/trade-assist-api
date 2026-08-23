import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { asyncHandler } from './utils/errors.js';
import routes from './routes/index.js';
import loginRoutes from './routes/login.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.use(requestLogger);

  app.get('/health', asyncHandler(async (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  }));

  app.get(`/api/${config.apiVersion}`, asyncHandler(async (_req, res) => {
    res.json({
      version: config.apiVersion,
      environment: config.env,
      timestamp: new Date().toISOString(),
    });
  }));

  app.use(`/api/${config.apiVersion}`, routes);
  app.use('/api/v1/auth', loginRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
