import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { Course } from '../interfaces/Course';

export interface CreateCourseInput {
  program_id: number;
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

function normalizeId(id: Course['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

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

export async function createCourse(input: CreateCourseInput): Promise<number> {
  const pool = getPool();
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

export async function listByProgram(programId: number, filters: ListCourseFilters) {
  const pool = getPool();
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

export async function deleteCourse(id: number): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM courses WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
