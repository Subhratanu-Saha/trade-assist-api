import { Router } from 'express';
import { requestLogger } from '../middleware/requestLogger.js';
import { getAgentAuth, loginAgent } from '../controllers/authController.js';
import {agentLoginMiddleware} from '../middleware/agentMiddleware.js';

const router = Router();

router.use(requestLogger);

router.get('/', getAgentAuth);
router.post('/', agentLoginMiddleware, loginAgent);

export default router;
