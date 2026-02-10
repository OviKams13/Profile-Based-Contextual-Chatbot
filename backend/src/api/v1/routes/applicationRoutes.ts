/**
 * Route registration for API v1 endpoints and middleware composition.
 */
import { Router } from 'express';
import * as ApplicationController from '../controllers/ApplicationController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import { listApplicationsSchema, submitApplicationSchema } from '../validations/applicationValidation';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('applicant'),
  validateRequest(submitApplicationSchema),
  ApplicationController.submit,
);
router.get(
  '/me',
  requireAuth,
  requireRole('applicant'),
  validateRequest(listApplicationsSchema),
  ApplicationController.myList,
);

export default router;
