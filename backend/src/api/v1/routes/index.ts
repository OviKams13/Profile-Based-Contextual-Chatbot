import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import programRoutes from './programRoutes';
import programCourseRoutes from './programCourseRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/programs/:programId/courses', programCourseRoutes);
router.use('/programs', programRoutes);
router.use('/courses', courseRoutes);

export default router;
