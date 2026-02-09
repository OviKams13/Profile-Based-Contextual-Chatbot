import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import programRoutes from './programRoutes';
import programCourseRoutes from './programCourseRoutes';
import programCoordinatorRoutes from './programCoordinatorRoutes';
import applicantRoutes from './applicantRoutes';
import applicationRoutes from './applicationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/programs/:programId/courses', programCourseRoutes);
router.use('/programs', programRoutes);
router.use('/courses', courseRoutes);
router.use('/program-coordinators', programCoordinatorRoutes);
router.use('/applicant', applicantRoutes);
router.use('/applications', applicationRoutes);

export default router;
