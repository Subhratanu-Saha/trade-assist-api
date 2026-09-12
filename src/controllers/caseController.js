import { asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';
import { updateCase } from '../services/caseService.js';

export const updateCaseDetails = asyncHandler(async (req, res) => {
  const { caseId, ...fields } = req.body;
  const updatedCase = await updateCase(caseId, fields);

  res.status(200).json(
    new SuccessResponse('Case details updated successfully', updatedCase)
  );
});