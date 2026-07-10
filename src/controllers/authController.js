
import { asyncHandler, AppError } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';
import { userService } from '../services/userService.js';
import { sanitizeObject } from '../utils/helpers.js';

export const loginAgent = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  // Step 1: read email & password
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  // Step 2: call service
  const user = await userService.findUserByEmail(email);

  // Step 3: receive user and validate credentials
  if (!user || user.password !== password) {
    throw new AppError(401, 'Invalid email or password');
  }

  const safeUser = sanitizeObject(user);

  // Step 4: return SuccessResponse
  res.json(new SuccessResponse('Login successful', { user: safeUser }));
});

