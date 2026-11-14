import { Router } from 'express';
import { getAgentAuth, loginAgent } from '../controllers/authController.js';
import { agentLoginMiddleware } from '../middleware/agentMiddleware.js';
import { loginRateLimiter } from '../middleware/loginRateLimiter.js';

const router = Router();

router.get('/', getAgentAuth);
router.post('/', loginRateLimiter, agentLoginMiddleware, loginAgent);

export default router;
