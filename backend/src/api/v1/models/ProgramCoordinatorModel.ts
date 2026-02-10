/**
 * Data-access functions that execute SQL queries against MySQL tables.
 */
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { ProgramCoordinator } from '../interfaces/ProgramCoordinator';

export interface CreateProgramCoordinatorInput {
  full_name: string;
  email: string;
  picture?: string | null;
  telephone_number?: string | null;
  nationality?: string | null;
  academic_qualification?: string | null;
  speciality?: string | null;
  office_location?: string | null;
  office_hours?: string | null;
}

export interface UpdateProgramCoordinatorInput {
  full_name: string;
  email: string;
  picture?: string | null;
  telephone_number?: string | null;
  nationality?: string | null;
  academic_qualification?: string | null;
  speciality?: string | null;
  office_location?: string | null;
  office_hours?: string | null;
}

function normalizeId(id: ProgramCoordinator['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

function toCoordinator(row: ProgramCoordinator): ProgramCoordinator {
  return {
    ...row,
    id: normalizeId(row.id),
  };
}

/**
 * createCoordinator service/controller utility.
 */
export async function createCoordinator(input: CreateProgramCoordinatorInput): Promise<number> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO program_coordinators
      (full_name, email, picture, telephone_number, nationality, academic_qualification, speciality, office_location, office_hours)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.full_name,
      input.email,
      input.picture ?? null,
      input.telephone_number ?? null,
      input.nationality ?? null,
      input.academic_qualification ?? null,
      input.speciality ?? null,
      input.office_location ?? null,
      input.office_hours ?? null,
    ],
  );
  return result.insertId;
}

/**
 * findById service/controller utility.
 */
export async function findById(id: number): Promise<ProgramCoordinator | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & ProgramCoordinator[]>(
    'SELECT * FROM program_coordinators WHERE id = ? LIMIT 1',
    [id],
  );
  if (!rows.length) {
    return null;
  }
  return toCoordinator(rows[0]);
}

/**
 * findByEmail service/controller utility.
 */
export async function findByEmail(email: string): Promise<ProgramCoordinator | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & ProgramCoordinator[]>(
    'SELECT * FROM program_coordinators WHERE email = ? LIMIT 1',
    [email],
  );
  if (!rows.length) {
    return null;
  }
  return toCoordinator(rows[0]);
}

/**
 * updateCoordinator service/controller utility.
 */
export async function updateCoordinator(
  id: number,
  input: UpdateProgramCoordinatorInput,
): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE program_coordinators
     SET full_name = ?, email = ?, picture = ?, telephone_number = ?, nationality = ?, academic_qualification = ?, speciality = ?, office_location = ?, office_hours = ?
     WHERE id = ?`,
    [
      input.full_name,
      input.email,
      input.picture ?? null,
      input.telephone_number ?? null,
      input.nationality ?? null,
      input.academic_qualification ?? null,
      input.speciality ?? null,
      input.office_location ?? null,
      input.office_hours ?? null,
      id,
    ],
  );

  return result.affectedRows > 0;
}
