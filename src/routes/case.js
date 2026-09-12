import { Router } from 'express';
import { requestLogger } from '../middleware/requestLogger.js';
import { caseMiddleware } from '../middleware/CaseMiddleware.js';
import { authenticate } from '../middleware/auth.js';
import { getCasesByCustomerId, updateCase } from '../controllers/caseController.js';
import { validateCaseUpdate, handleValidationErrors } from '../validators/index.js';

const router = Router();

router.use(requestLogger);

router.get('/list', caseMiddleware, getCasesByCustomerId);
router.post('/update', authenticate, caseMiddleware, validateCaseUpdate, handleValidationErrors, updateCase);

export default router;