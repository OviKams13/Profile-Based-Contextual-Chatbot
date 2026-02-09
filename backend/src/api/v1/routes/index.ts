import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import programRoutes from './programRoutes';
import programCourseRoutes from './programCourseRoutes';
import programCoordinatorRoutes from './programCoordinatorRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/programs/:programId/courses', programCourseRoutes);
router.use('/programs', programRoutes);
router.use('/courses', courseRoutes);
router.use('/program-coordinators', programCoordinatorRoutes);

export default router;
