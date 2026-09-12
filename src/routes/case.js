import { Router } from 'express';

import { requestLogger } from '../middleware/requestLogger.js';
import { caseMiddleware } from '../middleware/CaseMiddleware.js';
import { caseRetrieveMiddleware } from '../middleware/caseRetrieveMiddleware.js';

import { getCasesByCustomerId } from '../controllers/caseController.js';
import { getCaseById } from '../controllers/caseRetrieveController.js';

const router = Router();

router.use(requestLogger);

router.get('/list', caseMiddleware, getCasesByCustomerId);

router.get('/retrieve', caseRetrieveMiddleware, getCaseById);

export default router;