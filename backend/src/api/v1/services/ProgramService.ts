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
} from '../models/ProgramModel';
import { ProgramListQuery } from '../types/Pagination';

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
