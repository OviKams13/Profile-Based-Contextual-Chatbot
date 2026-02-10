/**
 * Route registration for API v1 endpoints and middleware composition.
 */
import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
import { requireAuth } from '../middlewares/requireAuth';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, registerSchema } from '../validations/authValidation';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me', requireAuth, AuthController.me);

export default router;
