import { Router } from 'express';
import { asyncHandler } from '../utils/errors.js';
import { validateUserCreation, handleValidationErrors } from '../validators/index.js';
import { agentLoginMiddleware } from '../middleware/auth.js';
import { loginAgent } from '../controllers/userController.js';

const router = Router();

router.post('/', agentLoginMiddleware, loginAgent);
router.post('/agent/login', agentLoginMiddleware, loginAgent);

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
