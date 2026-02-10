/**
 * Express middleware for cross-cutting concerns like auth and error handling.
 */
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/jwt';
import { AppError } from '../helpers/AppError';

/**
 * Validates Bearer JWT credentials and attaches decoded identity to `req.user`.
 *
 * Returns 401 when the header is missing, malformed, or token verification fails.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError('Authorization header missing', 401, 'UNAUTHORIZED'));
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Invalid authorization format', 401, 'UNAUTHORIZED'));
  }

  try {
    // Downstream handlers rely on `req.user` for ownership/role checks.
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
}
