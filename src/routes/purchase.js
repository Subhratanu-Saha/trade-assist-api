import { Router } from 'express';

import { purchaseMiddleware } from '../middleware/PurchaseMiddleware.js';
import { getPurchasesByCustomerId } from '../controllers/purchaseController.js';

const router = Router();

router.get('/', purchaseMiddleware, getPurchasesByCustomerId);

export default router;