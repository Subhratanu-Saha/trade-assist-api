import { updateFund as updateFundDetails } from '../services/fundService.js';
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

        if (!fundId || !customerId || !agentId) {
            throw new AppError(
                400,
                'fundId, customerId and agentId are mandatory'
            );
        }

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