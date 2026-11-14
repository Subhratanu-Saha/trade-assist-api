import { Router } from 'express';

import { requestLogger } from '../middleware/requestLogger.js';
import { fundMiddleware, fundUpdateMiddleware, fundRetrieveMiddleware,} from '../middleware/fundMiddleware.js';
import {
    createFund,
    updateFund,
    getFundsByCustomerId,
    getFundById,
} from '../controllers/fundController.js';


const router = Router();

router.use(requestLogger);

router.post('/create', createFund);
router.get('/list', fundMiddleware, getFundsByCustomerId);
router.get('/retrieve', fundRetrieveMiddleware, getFundById);
router.post('/update', fundUpdateMiddleware, updateFund);

export default router;