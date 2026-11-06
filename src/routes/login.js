import { Router } from 'express';
import { getAgentAuth, loginAgent } from '../controllers/authController.js';
import {agentLoginMiddleware} from '../middleware/agentMiddleware.js';

const router = Router();

router.get('/', getAgentAuth);
router.post('/', agentLoginMiddleware, loginAgent);

export default router;
