import bcrypt from 'bcrypt';

// Salt rounds remain configurable, with a safe default for local development.
function getSaltRounds(): number {
  const rounds = process.env.BCRYPT_SALT_ROUNDS
    ? Number(process.env.BCRYPT_SALT_ROUNDS)
    : 10;
  if (Number.isNaN(rounds) || rounds <= 0) {
    return 10;
  }
  return rounds;
}

// Hashes raw password before storing credentials in DB.
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = getSaltRounds();
  return bcrypt.hash(password, saltRounds);
}

// Compares login password with stored bcrypt hash.
export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
