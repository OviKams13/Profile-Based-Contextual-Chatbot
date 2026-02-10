import { Router } from 'express';
import * as ApplicantController from '../controllers/ApplicantController';
import { requireAuth } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

router.get('/profile', requireAuth, requireRole('applicant'), ApplicantController.getProfile);
router.put('/profile', requireAuth, requireRole('applicant'), ApplicantController.updateProfile);

export default router;
