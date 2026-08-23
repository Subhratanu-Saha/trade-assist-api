import { Router } from 'express';

import { requestLogger } from '../middleware/requestLogger.js';
import { purchaseMiddleware } from '../middleware/PurchaseMiddleware.js';
import { getPurchasesByCustomerId } from '../controllers/purchaseController.js';

const router = Router();

router.use(requestLogger);

router.get('/', purchaseMiddleware, getPurchasesByCustomerId);

export default router;