import { Router } from 'express';
import authRoutes from './authRoutes';
import programRoutes from './programRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/programs', programRoutes);

export default router;
