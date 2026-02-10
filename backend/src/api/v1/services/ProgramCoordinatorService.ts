import { AppError } from '../helpers/AppError';
import {
  createCoordinator,
  findByEmail,
  findById,
  updateCoordinator,
  CreateProgramCoordinatorInput,
  UpdateProgramCoordinatorInput,
} from '../models/ProgramCoordinatorModel';

// Coordinators have profile records only; normalized email avoids duplicate identities.
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function create(dto: CreateProgramCoordinatorInput) {
  const normalizedEmail = normalizeEmail(dto.email);
  const existing = await findByEmail(normalizedEmail);
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const coordinatorId = await createCoordinator({
    ...dto,
    email: normalizedEmail,
  });

  const coordinator = await findById(coordinatorId);
  if (!coordinator) {
    throw new AppError('Program coordinator creation failed', 500, 'COORDINATOR_CREATE_FAILED');
  }

  return coordinator;
}

export async function getById(id: number) {
  const coordinator = await findById(id);
  if (!coordinator) {
    throw new AppError('Program coordinator not found', 404, 'COORDINATOR_NOT_FOUND');
  }
  return coordinator;
}

export async function update(id: number, dto: UpdateProgramCoordinatorInput) {
  const existing = await findById(id);
  if (!existing) {
    throw new AppError('Program coordinator not found', 404, 'COORDINATOR_NOT_FOUND');
  }

  const normalizedEmail = normalizeEmail(dto.email);
  if (normalizedEmail !== existing.email) {
    const emailOwner = await findByEmail(normalizedEmail);
    if (emailOwner) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }
  }

  const updated = await updateCoordinator(id, {
    ...dto,
    email: normalizedEmail,
  });
  if (!updated) {
    throw new AppError('Program coordinator update failed', 500, 'COORDINATOR_UPDATE_FAILED');
  }

  const coordinator = await findById(id);
  if (!coordinator) {
    throw new AppError('Program coordinator not found', 404, 'COORDINATOR_NOT_FOUND');
  }

  return coordinator;
}
