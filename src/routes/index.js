import { Router } from 'express';

import userRoutes from './users.js';
import customerRoutes from './customer.js';

const router = Router();


router.use('/users', userRoutes);
router.use('/customers', customerRoutes);

export default router;
