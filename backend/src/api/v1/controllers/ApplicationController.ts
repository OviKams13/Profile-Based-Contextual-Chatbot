import { NextFunction, Request, Response } from 'express';
import { ok } from '../helpers/response';
import { AppError } from '../helpers/AppError';
import * as ApplicationService from '../services/ApplicationService';
import { listApplicationsSchema, submitApplicationSchema } from '../validations/applicationValidation';

// Submits an application with applicant profile snapshot in one request.
export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const parsed = submitApplicationSchema.parse({ body: req.body });
    const result = await ApplicationService.submitApplication(
      req.user.id,
      parsed.body.program_id,
      parsed.body.profile,
    );
    return ok(res, result, 201);
  } catch (error) {
    return next(error);
  }
}

// Lists only applications belonging to the authenticated applicant.
export async function myList(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const parsed = listApplicationsSchema.parse({ query: req.query });
    const result = await ApplicationService.listMyApplications(
      req.user.id,
      parsed.query.page,
      parsed.query.limit,
    );
    return ok(res, result, 200);
  } catch (error) {
    return next(error);
  }
}
