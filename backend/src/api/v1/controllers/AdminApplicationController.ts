import { NextFunction, Request, Response } from 'express';
import { ok } from '../helpers/response';
import { AppError } from '../helpers/AppError';
import * as AdminApplicationService from '../services/AdminApplicationService';
import {
  adminApplicationListSchema,
  adminApplicationParamsSchema,
} from '../validations/adminApplicationValidation';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const parsed = adminApplicationListSchema.parse({ query: req.query });
    const result = await AdminApplicationService.listAdminApplications(
      {
        status: parsed.query.status,
        programId: parsed.query.program_id,
        search: parsed.query.search,
        sort: parsed.query.sort,
      },
      parsed.query.page,
      parsed.query.limit,
    );
    return ok(res, result, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const parsed = adminApplicationParamsSchema.parse({ params: req.params });
    const application = await AdminApplicationService.getAdminApplicationDetail(parsed.params.id);
    return ok(res, { application }, 200);
  } catch (error) {
    return next(error);
  }
}

export async function accept(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const parsed = adminApplicationParamsSchema.parse({ params: req.params });
    const application = await AdminApplicationService.acceptApplication(parsed.params.id, req.user.id);
    return ok(res, { application }, 200);
  } catch (error) {
    return next(error);
  }
}

export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const parsed = adminApplicationParamsSchema.parse({ params: req.params });
    const application = await AdminApplicationService.rejectApplication(parsed.params.id, req.user.id);
    return ok(res, { application }, 200);
  } catch (error) {
    return next(error);
  }
}
