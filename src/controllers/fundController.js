
import {
  createFund as createFundDetails,
  getFundByFundId as fetchFundByFundId,
  getFundsByCustomerId as fetchFundsByCustomerId,
  updateFund as updateFundDetails,
} from '../services/fundService.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';

export const updateFund = asyncHandler(async (req, res) => {
    try {
        const {
            fundId,
            customerId,
            agentId,
            tenderType,
            fundAmount,
            reasonForFund,
            status,
            Approver,
        } = req.body;

        const updatedFund = await updateFundDetails({
            fundId,
            customerId,
            agentId,
            tenderType,
            fundAmount,
            reasonForFund,
            status,
            Approver,
        });

        if (!updatedFund) {
            throw new AppError(404, 'Fund record not found');
        }

        return res.status(200).json(
            new SuccessResponse(
                'Fund details updated successfully',
                updatedFund
            )
        );
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(500, 'Internal server error');
    }
});

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

export const getFundById = asyncHandler(async (req, res) => {
    const fund = await fetchFundByFundId(req.query.fundId);

    if (!fund) {
        throw new AppError(404, 'Fund record not found');
    }

    return res.status(200).json(
        new SuccessResponse('Fund retrieved successfully', fund)
    );

});

export const createFund = asyncHandler(async (_req, res) => {
  try {
    const fundId = await createFundDetails();

    return res.status(200).json({
      success: "true",
      message: "Fund id created successfully",
      fundId,
    });
  } catch (error) {
    throw new AppError(500, 'Internal server error');
  }
});