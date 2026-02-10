import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/jwt';
import { AppError } from '../helpers/AppError';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError('Authorization header missing', 401, 'UNAUTHORIZED'));
  }

  // API contract is strict Bearer token format to avoid ambiguous auth parsing.
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Invalid authorization format', 401, 'UNAUTHORIZED'));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
}
