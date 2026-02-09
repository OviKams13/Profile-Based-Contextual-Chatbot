import jwt from 'jsonwebtoken';
import { AuthPayload } from '../../../types/AuthPayload';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET in environment');
  }
  return secret;
}

export function signToken(payload: AuthPayload): string {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '1d';
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): AuthPayload {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as AuthPayload;
}
