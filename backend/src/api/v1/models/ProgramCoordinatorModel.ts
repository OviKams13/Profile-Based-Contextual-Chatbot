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

// Converts bigint coordinator ids for consistent API typing.
function normalizeId(id: ProgramCoordinator['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

// Normalizes DB row into coordinator domain structure.
function toCoordinator(row: ProgramCoordinator): ProgramCoordinator {
  return {
    ...row,
    id: normalizeId(row.id),
  };
}

// Inserts coordinator profile used by program assignments.
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

// Loads coordinator record for detail and assignment checks.
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

// Loads coordinator by email to enforce uniqueness.
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

// Updates mutable coordinator profile fields by id.
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
