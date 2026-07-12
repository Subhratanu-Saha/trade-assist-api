import { logger } from '../config/index.js';

export const requestLogger = (req, _res, next) => {
  logger.http(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};
