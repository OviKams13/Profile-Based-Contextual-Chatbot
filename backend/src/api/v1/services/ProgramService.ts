import { AppError } from '../helpers/AppError';
import { getPagination } from '../helpers/pagination';
import { Program } from '../interfaces/Program';
import {
  createProgram,
  findById,
  listPrograms,
  updateProgram,
  CreateProgramInput,
  UpdateProgramInput,
  updateProgramCoordinator,
} from '../models/ProgramModel';
import { ProgramListQuery } from '../types/Pagination';
import { findById as findCoordinatorById } from '../models/ProgramCoordinatorModel';

function normalizeProgramId(id: Program['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

export async function createProgramForDean(dto: Omit<CreateProgramInput, 'created_by'>, deanId: number) {
  const programId = await createProgram({
    ...dto,
    created_by: deanId,
  });
  const program = await findById(programId);
  if (!program) {
    throw new AppError('Program creation failed', 500, 'PROGRAM_CREATE_FAILED');
  }
  return program;
}

export async function listProgramsForPublic(query: ProgramListQuery) {
  const { page, limit } = getPagination(query.page, query.limit);
  const result = await listPrograms(query, page, limit);
  return {
    items: result.items,
    page,
    limit,
    total: result.total,
  };
}

export async function getProgramById(id: number) {
  const program = await findById(id);
  if (!program) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }
  return program;
}

export async function updateProgramForDean(
  id: number,
  dto: UpdateProgramInput,
  deanId: number,
) {
  const program = await findById(id);
  if (!program) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }

  if (normalizeProgramId(program.created_by) !== deanId) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  const updated = await updateProgram(id, dto);
  if (!updated) {
    throw new AppError('Program update failed', 500, 'PROGRAM_UPDATE_FAILED');
  }

  const refreshed = await findById(id);
  if (!refreshed) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }

  return refreshed;
}

export async function assignCoordinator(
  programId: number,
  coordinatorId: number | null,
  deanId: number,
) {
  const program = await findById(programId);
  if (!program) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }

  if (normalizeProgramId(program.created_by) !== deanId) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  if (coordinatorId !== null) {
    const coordinator = await findCoordinatorById(coordinatorId);
    if (!coordinator) {
      throw new AppError('Program coordinator not found', 404, 'COORDINATOR_NOT_FOUND');
    }
  }

  const updated = await updateProgramCoordinator(programId, coordinatorId);
  if (!updated) {
    throw new AppError('Program update failed', 500, 'PROGRAM_UPDATE_FAILED');
  }

  return { id: programId, program_coordinator_id: coordinatorId };
}
