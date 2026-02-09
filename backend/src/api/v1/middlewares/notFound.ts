import { Request, Response } from 'express';
import { fail } from '../helpers/response';

export function notFound(_req: Request, res: Response): Response {
  return fail(res, 'Route not found', 404, 'NOT_FOUND');
}
