import { getCaseByCaseId as fetchCaseByCaseId } from '../services/caseRetrieveService.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';

export const getCaseById = asyncHandler(async (req, res) => {
  try {
    const caseId = req.query.caseId;
    const singleCase = await fetchCaseByCaseId(caseId);

    if (!singleCase) {
      throw new AppError(404, 'Case record not found');
    }

    return res.status(200).json(
      new SuccessResponse('Case retrieved successfully', singleCase)
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(500, 'Internal server error');
  }
});