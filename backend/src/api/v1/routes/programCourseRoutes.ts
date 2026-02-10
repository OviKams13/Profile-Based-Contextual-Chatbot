/**
 * Route registration for API v1 endpoints and middleware composition.
 */
import { Router } from 'express';
import * as CourseController from '../controllers/CourseController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import { createCourseSchema } from '../validations/courseValidation';

const router = Router({ mergeParams: true });

router.get('/', CourseController.listForProgram);
router.post(
  '/',
  requireAuth,
  requireRole('dean'),
  validateRequest(createCourseSchema),
  CourseController.createForProgram,
);

export default router;
