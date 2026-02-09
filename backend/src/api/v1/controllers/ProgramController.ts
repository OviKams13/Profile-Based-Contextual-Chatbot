import { NextFunction, Request, Response } from 'express';
import { ok } from '../helpers/response';
import * as ProgramService from '../services/ProgramService';
import {
  listProgramsSchema,
  programIdSchema,
} from '../validations/programValidation';
import { AppError } from '../helpers/AppError';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const program = await ProgramService.createProgramForDean(req.body, req.user.id);
    return ok(res, { program }, 201);
  } catch (error) {
    return next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listProgramsSchema.parse({ query: req.query });
    const result = await ProgramService.listProgramsForPublic(parsed.query);
    return ok(res, result, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = programIdSchema.parse({ params: req.params });
    const program = await ProgramService.getProgramById(parsed.params.id);
    return ok(res, { program }, 200);
  } catch (error) {
    return next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const parsed = programIdSchema.parse({ params: req.params });
    const program = await ProgramService.updateProgramForDean(
      parsed.params.id,
      req.body,
      req.user.id,
    );
    return ok(res, { program }, 200);
  } catch (error) {
    return next(error);
  }
}
