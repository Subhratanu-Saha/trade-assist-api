import { Router } from 'express';

import { getFundsByCustomerId } from '../controllers/fundController.js';
import { fundMiddleware } from '../middleware/fundMiddleware.js';

const router = Router();

router.get('/list', fundMiddleware, getFundsByCustomerId);

export default router;