import { Router } from 'express';

import { requestLogger } from '../middleware/requestLogger.js';

import { updateFund } from '../controllers/fundController.js';

const router = Router();

router.use(requestLogger);

router.post('/update', updateFund);

export default router;