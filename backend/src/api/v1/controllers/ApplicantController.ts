/**
 * HTTP controller handlers for request orchestration and response shaping.
 */
import { NextFunction, Request, Response } from 'express';
import { ok } from '../helpers/response';
import { AppError } from '../helpers/AppError';
import * as ApplicantService from '../services/ApplicantService';
import { updateApplicantProfileSchema } from '../validations/applicantValidation';

/**
 * getProfile service/controller utility.
 */
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const profile = await ApplicantService.getProfile(req.user.id);
    return ok(res, { profile }, 200);
  } catch (error) {
    return next(error);
  }
}

/**
 * updateProfile service/controller utility.
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    updateApplicantProfileSchema.parse({ body: req.body });
    const profile = await ApplicantService.upsertProfile(req.user.id, req.body);
    return ok(res, { profile }, 200);
  } catch (error) {
    return next(error);
  }
}
