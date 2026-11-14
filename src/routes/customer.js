import { Router } from 'express';
import { customerSearchMiddleware } from '../middleware/customerSearchMiddleware.js';
import { searchCustomer } from '../services/customerSearchService.js';
import { asyncHandler } from '../utils/errors.js';
import { SuccessResponse, ErrorResponse } from '../utils/responses.js';
import { customerCreationMiddleware } from '../middleware/customerCreationMiddleware.js';
import { createCustomer } from '../services/customerService.js';

const router = Router();

router.get('/', customerSearchMiddleware, asyncHandler(async (req, res) => {
  const { email } = req.query;
  const customers = await searchCustomer(email);

  if (!customers || !customers.length) {
    return res.status(404).json(new ErrorResponse('No data found'));
  }

  res.json(new SuccessResponse('Customer search results retrieved successfully', customers));
}));


router.post(
  '/create-customer',
  customerCreationMiddleware,
  asyncHandler(async (req, res) => {
    const customer = await createCustomer(req.customerData);

    return res.status(201).json(
      new SuccessResponse(
        'Customer created successfully',
        customer
      )
    );
  })
);


export default router;