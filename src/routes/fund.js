import { Router } from 'express';

import { requestLogger } from '../middleware/requestLogger.js';
import { fundMiddleware } from '../middleware/fundMiddleware.js';
import { updateFund,   getFundsByCustomerId, } from '../controllers/fundController.js';

const router = Router();

router.use(requestLogger);

router.get('/list', fundMiddleware, getFundsByCustomerId);
router.post('/update', updateFund);

export default router;