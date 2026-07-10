import { Router } from 'express';
import { asyncHandler } from '../utils/errors.js';
import { validateUserCreation, handleValidationErrors } from '../validators/index.js';
import { loginAgent } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { requestLogger } from '../middleware/requestLogger.js';
import { SuccessResponse } from '../utils/responses.js';

const router = Router();

router.use(requestLogger);

// Protected info endpoint for authenticated agents
router.get(
  '/',
  authenticate,
  authorize('agent'),
  asyncHandler(async (req, res) => {
    res.json(new SuccessResponse('Agent auth endpoint', { methods: ['GET', 'POST'], user: req.user || null }));
  })
);

// POST /api/v1/auth - login with email + password
router.post('/', loginAgent);

router.post(
  '/register',
  validateUserCreation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, name } = req.body;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { email, name },
    });
  })
);

export default router;
