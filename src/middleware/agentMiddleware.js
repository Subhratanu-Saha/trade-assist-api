import { AppError } from '../utils/errors.js';

export const agentLoginMiddleware = (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return next(new AppError(400, 'Invalid agent credentials'));
    }


    next();
  } catch (error) {
    return next(new AppError(500, 'Agent login middleware failed'));
  }
};


