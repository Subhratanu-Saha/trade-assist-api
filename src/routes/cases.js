import { Router } from 'express';
import { updateCaseDetails } from '../controllers/caseController.js';
import { caseUpdateMiddleware } from '../middleware/caseUpdateMiddleware.js';

const router = Router();

router.post('/update', caseUpdateMiddleware, updateCaseDetails);

export default router;