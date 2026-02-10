/**
 * Express middleware for cross-cutting concerns like auth and error handling.
 */
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/AppError';

/**
 * requireRole service/controller utility.
 */
export function requireRole(role: 'dean' | 'applicant') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
    }

    if (req.user.role !== role) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }

    return next();
  };
}
