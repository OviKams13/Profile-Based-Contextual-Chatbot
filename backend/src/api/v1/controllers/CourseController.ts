/**
 * HTTP controller handlers for request orchestration and response shaping.
 */
import { NextFunction, Request, Response } from 'express';
import { ok } from '../helpers/response';
import { AppError } from '../helpers/AppError';
import * as CourseService from '../services/CourseService';
import {
  courseIdSchema,
  createCourseSchema,
  listCoursesSchema,
  programIdSchema,
  updateCourseSchema,
} from '../validations/courseValidation';

/**
 * createForProgram service/controller utility.
 */
export async function createForProgram(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const { params } = programIdSchema.parse({ params: req.params });
    createCourseSchema.parse({ body: req.body });
    const course = await CourseService.createForProgram(params.programId, req.body, req.user.id);
    return ok(res, { course }, 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * listForProgram service/controller utility.
 */
export async function listForProgram(req: Request, res: Response, next: NextFunction) {
  try {
    const { params } = programIdSchema.parse({ params: req.params });
    const { query } = listCoursesSchema.parse({ query: req.query });
    const result = await CourseService.listForProgram(params.programId, query);
    return ok(res, result, 200);
  } catch (error) {
    return next(error);
  }
}

/**
 * getById service/controller utility.
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { params } = courseIdSchema.parse({ params: req.params });
    const course = await CourseService.getById(params.id);
    return ok(res, { course }, 200);
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
    const { params } = courseIdSchema.parse({ params: req.params });
    updateCourseSchema.parse({ body: req.body });
    const course = await CourseService.update(params.id, req.body, req.user.id);
    return ok(res, { course }, 200);
  } catch (error) {
    return next(error);
  }
}

/**
 * remove service/controller utility.
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const { params } = courseIdSchema.parse({ params: req.params });
    const result = await CourseService.remove(params.id, req.user.id);
    return ok(res, result, 200);
  } catch (error) {
    return next(error);
  }
}
