import { Router } from 'express';
import * as AdminApplicationController from '../controllers/AdminApplicationController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import {
  adminApplicationListSchema,
  adminApplicationParamsSchema,
} from '../validations/adminApplicationValidation';

const router = Router();

// Review endpoints are dean-only to enforce admissions governance.
router.get(
  '/',
  requireAuth,
  requireRole('dean'),
  validateRequest(adminApplicationListSchema),
  AdminApplicationController.list,
);
router.get(
  '/:id',
  requireAuth,
  requireRole('dean'),
  validateRequest(adminApplicationParamsSchema),
  AdminApplicationController.getById,
);
router.patch(
  '/:id/accept',
  requireAuth,
  requireRole('dean'),
  validateRequest(adminApplicationParamsSchema),
  AdminApplicationController.accept,
);
router.patch(
  '/:id/reject',
  requireAuth,
  requireRole('dean'),
  validateRequest(adminApplicationParamsSchema),
  AdminApplicationController.reject,
);

export default router;
