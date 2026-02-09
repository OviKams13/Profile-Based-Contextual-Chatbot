import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../helpers/AppError';
import { fail } from '../helpers/response';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return fail(res, 'Validation error', 400, 'VALIDATION_ERROR', details);
  }

  if (err instanceof AppError) {
    return fail(res, err.message, err.statusCode, err.code, err.details);
  }

  return fail(res, 'Internal server error', 500, 'INTERNAL_SERVER_ERROR');
}
