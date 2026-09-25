import { getFundsByCustomerId as fetchFundsByCustomerId } from '../services/fundService.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';

export const getFundsByCustomerId = asyncHandler(async (req, res) => {
  const { customerId } = req.query;

  if (!customerId) {
    throw new AppError(400, 'customerId is required');
  }

  const funds = await fetchFundsByCustomerId(customerId);

  if (funds.length === 0) {
    throw new AppError(404, 'Fund records not found');
  }

  return res.status(200).json(
    new SuccessResponse('Funds retrieved successfully', funds)
  );
});