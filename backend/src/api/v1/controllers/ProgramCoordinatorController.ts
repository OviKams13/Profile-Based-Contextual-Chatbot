/**
 * HTTP controller handlers for request orchestration and response shaping.
 */
import { NextFunction, Request, Response } from 'express';
import { ok } from '../helpers/response';
import { AppError } from '../helpers/AppError';
import * as ProgramCoordinatorService from '../services/ProgramCoordinatorService';
import {
  coordinatorIdSchema,
  createCoordinatorSchema,
  updateCoordinatorSchema,
} from '../validations/programCoordinatorValidation';

/**
 * create service/controller utility.
 */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    createCoordinatorSchema.parse({ body: req.body });
    const program_coordinator = await ProgramCoordinatorService.create(req.body);
    return ok(res, { program_coordinator }, 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * getById service/controller utility.
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { params } = coordinatorIdSchema.parse({ params: req.params });
    const program_coordinator = await ProgramCoordinatorService.getById(params.id);
    return ok(res, { program_coordinator }, 200);
  } catch (error) {
    return next(error);
  }
}

/**
 * update service/controller utility.
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const { params } = coordinatorIdSchema.parse({ params: req.params });
    updateCoordinatorSchema.parse({ body: req.body });
    const program_coordinator = await ProgramCoordinatorService.update(params.id, req.body);
    return ok(res, { program_coordinator }, 200);
  } catch (error) {
    return next(error);
  }
}
