import { Router } from 'express';
import { asyncHandler, AppError } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';
import { userService } from '../services/userService.js';
import { sanitizeObject } from '../utils/helpers.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { requestLogger } from '../middleware/requestLogger.js';

const router = Router();

router.use(requestLogger);

// GET /api/v1/auth - protected info for authenticated agents
router.get('/', authenticate, authorize('agent'), asyncHandler(async (req, res) => {
	res.json(new SuccessResponse('Agent auth endpoint', {
		methods: ['GET', 'POST'],
		user: req.user || null,
	}));
}));

// POST /api/v1/auth - login with email + password
router.post('/', asyncHandler(async (req, res) => {
	const { email, password } = req.body || {};

	if (!email || !password) {
		throw new AppError(400, 'Email and password are required');
	}

	const user = await userService.findUserByEmail(email);

	if (!user || user.password !== password) {
		throw new AppError(401, 'Invalid email or password');
	}

	const safeUser = sanitizeObject(user);

	res.json(new SuccessResponse('Login successful', { user: safeUser }));
}));

export default router;
