import { getPurchasesByCustomerId as fetchPurchasesByCustomerId } from '../services/purchaseService.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';

export const getPurchasesByCustomerId = asyncHandler(async (req, res) => {
  try {
    const purchases = await fetchPurchasesByCustomerId(req.query.customerId);

    if (!purchases || purchases.length === 0) {
      throw new AppError(404, 'Purchase records not found');
    }

    return res.status(200).json(
      new SuccessResponse('Purchases retrieved successfully', purchases)
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(500, 'Internal server error');
  }
});
