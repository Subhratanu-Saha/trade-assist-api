import { Router } from 'express';
import { requestLogger } from '../middleware/requestLogger.js';
import { customerSearchMiddleware } from '../middleware/customerSearchMiddleware.js';
import { searchCustomer } from '../services/customerSearchService.js';
import { asyncHandler } from '../utils/errors.js';
import { SuccessResponse, ErrorResponse } from '../utils/responses.js';

const router = Router();

router.use(requestLogger);

router.get('/', customerSearchMiddleware, asyncHandler(async (req, res) => {
  const { email } = req.query;
  const customers = await searchCustomer(email);

  if (!customers?.data?.length) {
    return res.status(404).json(new ErrorResponse('No data found'));
  }

  res.json(new SuccessResponse('Customer search results retrieved successfully', customers));
}));

export default router;