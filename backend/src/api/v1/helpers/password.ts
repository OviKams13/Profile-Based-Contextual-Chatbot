/**
 * Shared helper utilities for reusable API behavior and transformations.
 */
import bcrypt from 'bcrypt';

function getSaltRounds(): number {
  const rounds = process.env.BCRYPT_SALT_ROUNDS
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : 10;
  if (Number.isNaN(rounds) || rounds <= 0) {
    return 10;
  }
  return rounds;
}

/**
 * hashPassword service/controller utility.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = getSaltRounds();
  return bcrypt.hash(password, saltRounds);
}

/**
 * comparePassword service/controller utility.
 */
export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
