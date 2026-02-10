/**
 * Route registration for API v1 endpoints and middleware composition.
 */
import { Router } from 'express';
import * as CourseController from '../controllers/CourseController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import { updateCourseSchema } from '../validations/courseValidation';

const router = Router();

router.get('/:id', CourseController.getById);
router.put(
  '/:id',
  requireAuth,
  requireRole('dean'),
  validateRequest(updateCourseSchema),
  CourseController.update,
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('dean'),
  CourseController.remove,
);

export default router;
