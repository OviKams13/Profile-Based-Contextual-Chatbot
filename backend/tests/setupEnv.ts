import dotenv from 'dotenv';

dotenv.config();
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test_secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1d';
process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ?? '10';
process.env.NODE_ENV = 'test';
