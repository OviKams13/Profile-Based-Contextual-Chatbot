import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

// Runs zod schema against body, params, and query inputs.
export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Parse body/params/query together so each route can validate all incoming channels.
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    return next();
  };
}
