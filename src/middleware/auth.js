import { AppError } from '../utils/errors.js';

export const agentLoginMiddleware = (req, res, next) => {
  try {
    const { email, password, agentKey } = req.body || {};
    const configuredAgentKey = process.env.AGENT_LOGIN_KEY;

    if (!email || !password || !agentKey || !configuredAgentKey) {
      return next(new AppError(401, 'Invalid agent credentials'));
    }

    if (agentKey !== configuredAgentKey) {
      return next(new AppError(401, 'Invalid agent credentials'));
    }

    req.agent = {
      email,
      role: 'agent',
      authenticated: true,
    };

    return next();
  } catch (error) {
    return next(new AppError(500, 'Agent login middleware failed'));
  }
};

export const authenticateAgent = (req, _res, next) => {
  if (req.agent?.authenticated) {
    return next();
  }

  return next(new AppError(401, 'Agent authentication required'));
};

