import { AppError } from '../utils/errors.js';

export const fundMiddleware = (req, res, next) => {
  try {
    const customerId = String(req.query.customerId || '').trim();

    if (!customerId) {
      return next(new AppError(400, 'customerId is required'));
    }

    req.query.customerId = customerId;
    next();
  } catch (error) {
    return next(new AppError(500, 'Fund middleware failed'));
  }
};

export const fundRetrieveMiddleware = (req, res, next) => {
    const fundId = String(req.query.fundId || '').trim();

    if (!fundId) {
        return next(new AppError(400, 'fundId is required'));
    }

    req.query.fundId = fundId;
    return next();
};

export const fundUpdateMiddleware = (req, res, next) => {
    try {
        const { fundId, customerId, agentId } = req.body;

        if (!fundId || !customerId || !agentId) {
            return next(
                new AppError(
                    400,
                    'fundId, customerId and agentId are mandatory'
                )
            );
        }

        next();
    } catch (error) {
        return next(new AppError(500, 'Fund update middleware failed'));
    }
};