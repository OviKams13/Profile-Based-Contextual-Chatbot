import { Response } from 'express';

export function ok<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}

export function fail(
  res: Response,
  message: string,
  status: number,
  code: string,
  details?: unknown,
): Response {
  return res.status(status).json({
    success: false,
    error: {
      message,
      code,
      ...(details ? { details } : {}),
    },
  });
}
