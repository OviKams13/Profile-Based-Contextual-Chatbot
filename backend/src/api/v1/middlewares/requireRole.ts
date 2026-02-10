import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/AppError';

export function requireRole(role: 'dean' | 'applicant') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
    }

    // Role gate protects dean-only administration and applicant-only personal flows.
    if (req.user.role !== role) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }

    return next();
  };
}
