import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { Program } from '../interfaces/Program';
import { ProgramListQuery } from '../types/Pagination';

export interface CreateProgramInput {
  created_by: number;
  program_coordinator_id?: number | null;
  name: string;
  level: 'undergraduate' | 'postgraduate';
  duration_years: number;
  short_description: string;
  about_text: string;
  entry_requirements_text: string;
  scholarships_text: string;
}

export interface UpdateProgramInput {
  name: string;
  level: 'undergraduate' | 'postgraduate';
  duration_years: number;
  short_description: string;
  about_text: string;
  entry_requirements_text: string;
  scholarships_text: string;
}

function normalizeId(id: Program['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

function toProgram(row: Program): Program {
  return {
    ...row,
    id: normalizeId(row.id),
    created_by: normalizeId(row.created_by),
    program_coordinator_id:
      row.program_coordinator_id === null
        ? null
        : normalizeId(row.program_coordinator_id),
  };
}

export async function createProgram(input: CreateProgramInput): Promise<number> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO programs
      (created_by, program_coordinator_id, name, level, duration_years, short_description, about_text, entry_requirements_text, scholarships_text)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.created_by,
      input.program_coordinator_id ?? null,
      input.name,
      input.level,
      input.duration_years,
      input.short_description,
      input.about_text,
      input.entry_requirements_text,
      input.scholarships_text,
    ],
  );
  return result.insertId;
}

export async function findById(id: number): Promise<Program | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & Program[]>(
    'SELECT * FROM programs WHERE id = ? LIMIT 1',
    [id],
  );
  if (!rows.length) {
    return null;
  }
  return toProgram(rows[0]);
}

export async function updateProgram(id: number, input: UpdateProgramInput): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE programs
     SET name = ?, level = ?, duration_years = ?, short_description = ?, about_text = ?, entry_requirements_text = ?, scholarships_text = ?
     WHERE id = ?`,
    [
      input.name,
      input.level,
      input.duration_years,
      input.short_description,
      input.about_text,
      input.entry_requirements_text,
      input.scholarships_text,
      id,
    ],
  );

  return result.affectedRows > 0;
}

function buildFilters(query: ProgramListQuery) {
  const whereClauses: string[] = [];
  const params: Array<string | number> = [];

  if (query.level) {
    whereClauses.push('level = ?');
    params.push(query.level);
  }

  if (query.search) {
    whereClauses.push('name LIKE ?');
    params.push(`%${query.search}%`);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  return { whereSql, params };
}

export async function listPrograms(query: ProgramListQuery, page: number, limit: number) {
  const pool = getPool();
  const { whereSql, params } = buildFilters(query);
  const offset = (page - 1) * limit;

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM programs ${whereSql}`,
    params,
  );
  const total = Number(countRows[0]?.total ?? 0);

  const [rows] = await pool.query<RowDataPacket[] & Program[]>(
    `SELECT * FROM programs ${whereSql} ORDER BY name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  return {
    items: rows.map((row) => toProgram(row)),
    total,
  };
}
