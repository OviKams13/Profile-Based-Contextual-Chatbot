import { Router } from 'express';
import * as ProgramController from '../controllers/ProgramController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import { createProgramSchema, updateProgramSchema } from '../validations/programValidation';
import { assignCoordinatorSchema } from '../validations/programCoordinatorValidation';

const router = Router();

// Program catalog is public, but writes are restricted to dean users below.
router.get('/', ProgramController.list);
router.get('/:id', ProgramController.getById);
router.post(
  '/',
  requireAuth,
  requireRole('dean'),
  validateRequest(createProgramSchema),
  ProgramController.create,
);
router.put(
  '/:id',
  requireAuth,
  requireRole('dean'),
  validateRequest(updateProgramSchema),
  ProgramController.update,
);
router.patch(
  '/:id/assign-coordinator',
  requireAuth,
  requireRole('dean'),
  validateRequest(assignCoordinatorSchema),
  ProgramController.assignCoordinator,
);

export default router;
