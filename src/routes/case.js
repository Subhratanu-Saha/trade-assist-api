import { Router } from 'express';
import { requestLogger } from '../middleware/requestLogger.js';
import { caseMiddleware } from '../middleware/CaseMiddleware.js';
import { getCasesByCustomerId, updateCase } from '../controllers/caseController.js';


const router = Router();

router.use(requestLogger);

router.get('/list', caseMiddleware, getCasesByCustomerId);
router.post('/update', caseMiddleware, updateCase);

export default router;