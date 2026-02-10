import { NextFunction, Request, Response } from 'express';
import * as AuthService from '../services/AuthService';
import { ok } from '../helpers/response';
import { AppError } from '../helpers/AppError';

// Handles signup flow and returns token so client can continue authenticated onboarding.
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.register(req.body);
    return ok(res, result, 201);
  } catch (error) {
    return next(error);
  }
}

// Authenticates existing users and issues JWT used by protected endpoints.
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AuthService.login(req.body);
    return ok(res, result, 200);
  } catch (error) {
    return next(error);
  }
}

// Returns identity from token payload to avoid extra client-side state assumptions.
export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }
    const result = await AuthService.getMe(req.user.id);
    return ok(res, result, 200);
  } catch (error) {
    return next(error);
  }
}
