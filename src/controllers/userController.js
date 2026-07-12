import { asyncHandler } from '../utils/errors.js';
import { SuccessResponse } from '../utils/responses.js';
import { userService } from '../services/userService.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await userService.getAllUsers();
  res.json(new SuccessResponse('Users retrieved successfully', users));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(parseInt(req.params.id));
  res.json(new SuccessResponse('User retrieved successfully', user));
});
