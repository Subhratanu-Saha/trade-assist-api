import { logger } from '../config/index.js';

export const requestLogger = (req, res, next) => {
    const startTime= Date.now();

    res.on('finish', () => {
    const duration = Date.now() - startTime;

    logger.http(
      `Trade-Assist API - ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });
  
  next();
};
