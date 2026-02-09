import { NextFunction, Request, Response } from 'express';
import { ok } from '../helpers/response';
import { AppError } from '../helpers/AppError';
import * as ApplicantService from '../services/ApplicantService';
import { updateApplicantProfileSchema } from '../validations/applicantValidation';

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

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    updateApplicantProfileSchema.parse({ body: req.body });
    const profile = await ApplicantService.upsertProfile(req.user.id, req.body, req.user.email);
    return ok(res, { profile }, 200);
  } catch (error) {
    return next(error);
  }
}
