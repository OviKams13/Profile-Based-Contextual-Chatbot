import { Router } from 'express';
import * as ApplicationController from '../controllers/ApplicationController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import { listApplicationsSchema, submitApplicationSchema } from '../validations/applicationValidation';

const router = Router();

// Only applicants can submit their own applications and view their own list.
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
