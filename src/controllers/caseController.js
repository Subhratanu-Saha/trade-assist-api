import {
  getCaseByCaseId as fetchCaseByCaseId,
  getCasesByCustomerId as fetchCasesByCustomerId,
  updateCase as updateCaseDetails,
} from '../services/caseService.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';

export const getCasesByCustomerId = asyncHandler(async (req, res) => {
  try {
    const cases = await fetchCasesByCustomerId(req.query.customerId);

    if (!cases || (cases.open.length === 0 && cases.closed.length === 0 )){
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

export const getCaseById = asyncHandler(async (req, res) => {
  try {
    const singleCase = await fetchCaseByCaseId(req.query.caseId);

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

export const updateCase = asyncHandler(async (req, res) => {
  const updatedCase = await updateCaseDetails(req.body);

  const message = updatedCase.isCompleted
    ? 'Case completed successfully'
    : 'Case updated successfully';

  return res.status(200).json(
    new SuccessResponse(message, updatedCase)
  );
});