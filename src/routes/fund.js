import { Router } from 'express';

import { requestLogger } from '../middleware/requestLogger.js';
import {
  createFund,
  getFundById,
  getFundsByCustomerId,
  updateFund,
} from '../controllers/fundController.js';
import {
  fundMiddleware,
  fundRetrieveMiddleware,
  fundUpdateMiddleware,
} from '../middleware/fundMiddleware.js';

const router = Router();

router.use(requestLogger);

router.get('/list', fundMiddleware, getFundsByCustomerId);
router.get('/retrieve', fundRetrieveMiddleware, getFundById);
router.post('/update', fundUpdateMiddleware, updateFund);

router.post('/create', createFund);

export default router;