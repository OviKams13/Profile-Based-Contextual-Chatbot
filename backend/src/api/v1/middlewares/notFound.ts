/**
 * Express middleware for cross-cutting concerns like auth and error handling.
 */
import { Request, Response } from 'express';
import { fail } from '../helpers/response';

/**
 * notFound service/controller utility.
 */
export function notFound(_req: Request, res: Response): Response {
  return fail(res, 'Route not found', 404, 'NOT_FOUND');
}
