import { getCasesByCustomerId as fetchCasesByCustomerId } from '../services/caseService.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';

export const getCasesByCustomerId = asyncHandler(async (req, res) => {
  try {
    const cases = await fetchCasesByCustomerId(req.query.customerId);

    if (!cases || cases.length === 0) {
      throw new AppError(404, 'Case records not found');
    }

    return res.status(200).json(
      new SuccessResponse('Cases retrieved successfully', cases)
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(500, 'Internal server error');
  }
});