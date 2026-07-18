import { Router } from 'express';
import { requestLogger } from '../middleware/requestLogger.js';
import { getAgentAuth, loginAgent } from '../controllers/authController.js';

const router = Router();

router.use(requestLogger);

router.get('/', getAgentAuth);
router.post('/', loginAgent);

export default router;
