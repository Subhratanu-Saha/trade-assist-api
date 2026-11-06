import { Router } from 'express';

import { fundMiddleware,fundUpdateMiddleware, } from '../middleware/fundMiddleware.js';
import { updateFund,   getFundsByCustomerId, } from '../controllers/fundController.js';
import { fundRetrieveMiddleware } from '../middleware/fundMiddleware.js';
import { getFundById } from '../controllers/fundController.js';

const router = Router();

router.get('/list', fundMiddleware, getFundsByCustomerId);
router.get('/retrieve', fundRetrieveMiddleware, getFundById);
router.post('/update', fundUpdateMiddleware, updateFund);

export default router;