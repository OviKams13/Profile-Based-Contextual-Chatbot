/**
 * Route registration for API v1 endpoints and middleware composition.
 */
import { Router } from 'express';
import * as ProgramCoordinatorController from '../controllers/ProgramCoordinatorController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createCoordinatorSchema,
  updateCoordinatorSchema,
} from '../validations/programCoordinatorValidation';

const router = Router();

router.get('/:id', ProgramCoordinatorController.getById);
router.post(
  '/',
  requireAuth,
  requireRole('dean'),
  validateRequest(createCoordinatorSchema),
  ProgramCoordinatorController.create,
);
router.put(
  '/:id',
  requireAuth,
  requireRole('dean'),
  validateRequest(updateCoordinatorSchema),
  ProgramCoordinatorController.update,
);

export default router;
