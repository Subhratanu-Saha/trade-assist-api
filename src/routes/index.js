import { Router } from 'express';

import userRoutes from './users.js';

import customerRoutes from './customer.js';

import purchaseRoutes from './purchase.js';

import caseRoutes from './case.js';

const router = Router();

router.use('/users', userRoutes);

router.use('/customers', customerRoutes);

router.use('/purchase', purchaseRoutes);

router.use('/cases', caseRoutes);

export default router;