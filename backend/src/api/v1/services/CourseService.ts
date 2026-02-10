import { AppError } from '../helpers/AppError';
import { normalizeCourseInput } from '../helpers/normalize';
import { Program } from '../interfaces/Program';
import {
  createCourse,
  deleteCourse,
  findById,
  findByProgramAndCode,
  listByProgram,
  updateCourse,
  CreateCourseInput,
  UpdateCourseInput,
  ListCourseFilters,
} from '../models/CourseModel';
import { findById as findProgramById } from '../models/ProgramModel';

function normalizeProgramId(id: Program['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

// Courses inherit ownership from their parent program to keep governance consistent.
function ensureOwnership(program: Program, deanId: number) {
  if (normalizeProgramId(program.created_by) !== deanId) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }
}

// A course cannot be attached outside the declared program duration timeline.
function ensureYearWithinDuration(year: number, durationYears: number) {
  if (year < 1 || year > durationYears) {
    throw new AppError('Year number exceeds program duration', 400, 'INVALID_YEAR_NUMBER');
  }
}

export async function createForProgram(
  programId: number,
  dto: Omit<CreateCourseInput, 'program_id'>,
  deanId: number,
) {
  const program = await findProgramById(programId);
  if (!program) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }

  ensureOwnership(program, deanId);
  ensureYearWithinDuration(dto.year_number, program.duration_years);

  const normalized = normalizeCourseInput({
    ...dto,
    ects: dto.ects ?? 7.5,
  });

  const existing = await findByProgramAndCode(programId, normalized.course_code);
  if (existing) {
    throw new AppError('Course code already exists for this program', 409, 'COURSE_CODE_EXISTS');
  }

  const courseId = await createCourse({
    ...normalized,
    program_id: programId,
    created_by: deanId,
  });

  const course = await findById(courseId);
  if (!course) {
    throw new AppError('Course creation failed', 500, 'COURSE_CREATE_FAILED');
  }

  return course;
}

export async function listForProgram(programId: number, filters: ListCourseFilters) {
  const program = await findProgramById(programId);
  if (!program) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }

  const items = await listByProgram(programId, filters);
  return {
    program_id: programId,
    items,
  };
}

export async function getById(courseId: number) {
  const course = await findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  }
  return course;
}

export async function update(courseId: number, dto: UpdateCourseInput, deanId: number) {
  const course = await findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  }

  const program = await findProgramById(Number(course.program_id));
  if (!program) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }

  ensureOwnership(program, deanId);
  ensureYearWithinDuration(dto.year_number, program.duration_years);

  const normalized = normalizeCourseInput({
    ...dto,
    ects: dto.ects ?? 7.5,
  });

  if (normalized.course_code !== course.course_code) {
    const duplicate = await findByProgramAndCode(Number(course.program_id), normalized.course_code);
    if (duplicate) {
      throw new AppError('Course code already exists for this program', 409, 'COURSE_CODE_EXISTS');
    }
  }

  const updated = await updateCourse(courseId, normalized);
  if (!updated) {
    throw new AppError('Course update failed', 500, 'COURSE_UPDATE_FAILED');
  }

  const refreshed = await findById(courseId);
  if (!refreshed) {
    throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  }

  return refreshed;
}

export async function remove(courseId: number, deanId: number) {
  const course = await findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
  }

  const program = await findProgramById(Number(course.program_id));
  if (!program) {
    throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
  }

  ensureOwnership(program, deanId);

  const deleted = await deleteCourse(courseId);
  if (!deleted) {
    throw new AppError('Course delete failed', 500, 'COURSE_DELETE_FAILED');
  }

  return { deleted: true };
}
