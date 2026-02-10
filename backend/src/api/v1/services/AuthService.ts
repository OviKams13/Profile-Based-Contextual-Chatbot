/**
 * Service layer for business rules, authorization checks, and orchestration.
 */
import { AppError } from '../helpers/AppError';
import { comparePassword, hashPassword } from '../helpers/password';
import { signToken } from '../helpers/jwt';
import {
  createUser,
  findByEmail,
  findById,
  CreateUserInput,
} from '../models/UserModel';
import { PublicUser, User } from '../../../interfaces/User';

export interface RegisterDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'dean' | 'applicant';
}

export interface LoginDto {
  email: string;
  password: string;
}

function normalizeUserId(id: User['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

function toPublicUser(user: User): PublicUser {
  const { password_hash: _password, ...rest } = user;
  return {
    ...rest,
    id: normalizeUserId(user.id),
  };
}

/**
 * register service/controller utility.
 */
export async function register(dto: RegisterDto) {
  const existing = await findByEmail(dto.email);
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const password_hash = await hashPassword(dto.password);
  const input: CreateUserInput = {
    first_name: dto.first_name,
    last_name: dto.last_name,
    email: dto.email,
    password_hash,
    role: dto.role,
  };

  const userId = await createUser(input);
  const user = await findById(userId);
  if (!user) {
    throw new AppError('User creation failed', 500, 'USER_CREATE_FAILED');
  }

  const token = signToken({
    id: normalizeUserId(user.id),
    email: user.email,
    role: user.role,
  });

  return { user: toPublicUser(user), token };
}

/**
 * login service/controller utility.
 */
export async function login(dto: LoginDto) {
  const user = await findByEmail(dto.email);
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isValid = await comparePassword(dto.password, user.password_hash);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({
    id: normalizeUserId(user.id),
    email: user.email,
    role: user.role,
  });

  return { user: toPublicUser(user), token };
}

/**
 * getMe service/controller utility.
 */
export async function getMe(userId: number) {
  const user = await findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return { user: toPublicUser(user) };
}
