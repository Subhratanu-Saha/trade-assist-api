import { AppError } from '../utils/errors.js';

export const purchaseMiddleware = (req, res, next) => {
  try {
    const { userId, symbol, quantity, price } = req.body;

    if (!userId || !symbol || !quantity || !price) {
      return next(
        new AppError(400, 'userId, symbol, quantity and price are required')
      );
    }

    if (quantity <= 0) {
      return next(
        new AppError(400, 'Quantity must be greater than 0')
      );
    }

    if (price <= 0) {
      return next(
        new AppError(400, 'Price must be greater than 0')
      );
    }

    req.body.type = 'BUY';

    next();
  } catch (error) {
    return next(
      new AppError(500, 'Purchase middleware failed')
    );
  }
};