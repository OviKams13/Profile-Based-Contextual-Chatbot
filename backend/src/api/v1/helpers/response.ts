import { Response } from 'express';

// Response envelope stays stable across all features: success + data or success + error.
export function ok<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}

// Formats error API response envelope consistently.
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
