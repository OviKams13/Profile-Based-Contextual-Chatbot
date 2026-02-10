import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { Course } from '../interfaces/Course';

export interface CreateCourseInput {
  program_id: number;
  created_by?: number;
  year_number: number;
  course_name: string;
  course_code: string;
  credits: number;
  theoretical_hours: number;
  practical_hours: number;
  distance_hours: number;
  ects: number;
  course_description: string;
}

export interface UpdateCourseInput {
  year_number: number;
  course_name: string;
  course_code: string;
  credits: number;
  theoretical_hours: number;
  practical_hours: number;
  distance_hours: number;
  ects: number;
  course_description: string;
}

export interface ListCourseFilters {
  year?: number;
  sort?: 'year' | 'name';
}

// Converts bigint ids to standard numbers for API output.
function normalizeId(id: Course['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

// Normalizes a course row into response-safe structure.
function toCourse(row: Course): Course {
  return {
    ...row,
    id: normalizeId(row.id),
    program_id: normalizeId(row.program_id),
    created_by:
      row.created_by === undefined || row.created_by === null
        ? row.created_by
        : normalizeId(row.created_by),
  };
}

// Inserts a course under program and dean ownership scope.
export async function createCourse(input: CreateCourseInput): Promise<number> {
  const pool = getPool();
  if (input.created_by !== undefined) {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO courses
          (program_id, created_by, year_number, course_name, course_code, credits, theoretical_hours, practical_hours, distance_hours, ects, course_description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.program_id,
          input.created_by,
          input.year_number,
          input.course_name,
          input.course_code,
          input.credits,
          input.theoretical_hours,
          input.practical_hours,
          input.distance_hours,
          input.ects,
          input.course_description,
        ],
      );
      return result.insertId;
    } catch (error: any) {
      if (error?.code !== 'ER_BAD_FIELD_ERROR') {
        throw error;
      }
    }
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO courses
      (program_id, year_number, course_name, course_code, credits, theoretical_hours, practical_hours, distance_hours, ects, course_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.program_id,
      input.year_number,
      input.course_name,
      input.course_code,
      input.credits,
      input.theoretical_hours,
      input.practical_hours,
      input.distance_hours,
      input.ects,
      input.course_description,
    ],
  );
  return result.insertId;
}

// Fetches one course for read/update/delete workflows.
export async function findById(id: number): Promise<Course | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & Course[]>(
    'SELECT * FROM courses WHERE id = ? LIMIT 1',
    [id],
  );
  if (!rows.length) {
    return null;
  }
  return toCourse(rows[0]);
}

// Checks per-program course code uniqueness constraint.
export async function findByProgramAndCode(
  programId: number,
  courseCode: string,
): Promise<Course | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & Course[]>(
    'SELECT * FROM courses WHERE program_id = ? AND course_code = ? LIMIT 1',
    [programId, courseCode],
  );
  if (!rows.length) {
    return null;
  }
  return toCourse(rows[0]);
}

// Returns program-scoped course list with optional filters.
export async function listByProgram(programId: number, filters: ListCourseFilters) {
  const pool = getPool();
  // Course list can be filtered by year while remaining scoped to one program.
  const whereClauses: string[] = ['program_id = ?'];
  const params: Array<string | number> = [programId];

  if (filters.year) {
    whereClauses.push('year_number = ?');
    params.push(filters.year);
  }

  const orderBy = filters.sort === 'name'
    ? 'course_name ASC'
    : 'year_number ASC, course_name ASC';

  const [rows] = await pool.query<RowDataPacket[] & Course[]>(
    `SELECT * FROM courses WHERE ${whereClauses.join(' AND ')} ORDER BY ${orderBy}`,
    params,
  );

  return rows.map((row) => toCourse(row));
}

// Persists course changes for an existing course id.
export async function updateCourse(id: number, input: UpdateCourseInput): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE courses
     SET year_number = ?, course_name = ?, course_code = ?, credits = ?, theoretical_hours = ?, practical_hours = ?, distance_hours = ?, ects = ?, course_description = ?
     WHERE id = ?`,
    [
      input.year_number,
      input.course_name,
      input.course_code,
      input.credits,
      input.theoretical_hours,
      input.practical_hours,
      input.distance_hours,
      input.ects,
      input.course_description,
      id,
    ],
  );

  return result.affectedRows > 0;
}

// Removes course row when ownership checks already passed.
export async function deleteCourse(id: number): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM courses WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
