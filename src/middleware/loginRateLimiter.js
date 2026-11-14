import { rateLimit } from 'express-rate-limit';
import { ErrorResponse } from '../utils/responses.js';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res
      .status(429)
      .json(
        new ErrorResponse(
          'Too many login attempts',
          'Please try again in 15 minutes.'
        )
      ),
});
