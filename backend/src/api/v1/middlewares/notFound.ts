import { Request, Response } from 'express';
import { fail } from '../helpers/response';

// Returns uniform 404 payload for unmatched API routes.
export function notFound(_req: Request, res: Response): Response {
  return fail(res, 'Route not found', 404, 'NOT_FOUND');
}
