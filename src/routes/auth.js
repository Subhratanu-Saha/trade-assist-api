import { Router } from 'express';
import { asyncHandler } from '../utils/errors.js';
import { validateUserCreation, handleValidationErrors } from '../validators/index.js';

const router = Router();

router.post(
  '/register',
  validateUserCreation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { email, name },
    });
  })
);

export default router;
