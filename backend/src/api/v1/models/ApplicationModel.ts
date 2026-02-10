/**
 * Data-access functions that execute SQL queries against MySQL tables.
 */
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { Application, ApplicationListItem } from '../interfaces/Application';

export interface CreateApplicationInput {
  applicant_id: number;
  program_id: number;
  created_by: number;
  status?: 'submitted' | 'accepted' | 'rejected';
}

function normalizeId(id: Application['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

function toApplication(row: Application): Application {
  return {
    ...row,
    id: normalizeId(row.id),
    applicant_id: normalizeId(row.applicant_id),
    program_id: normalizeId(row.program_id),
    reviewed_by: row.reviewed_by === null ? null : normalizeId(row.reviewed_by),
  };
}

/**
 * createApplication service/controller utility.
 */
export async function createApplication(
  conn: PoolConnection,
  input: CreateApplicationInput,
): Promise<number> {
  const [result] = await conn.query<ResultSetHeader>(
    'INSERT INTO applications (applicant_id, program_id, created_by, status) VALUES (?, ?, ?, ?)',
    [input.applicant_id, input.program_id, input.created_by, input.status ?? 'submitted'],
  );
  return result.insertId;
}

/**
 * findById service/controller utility.
 */
export async function findById(id: number): Promise<Application | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & Application[]>(
    'SELECT * FROM applications WHERE id = ? LIMIT 1',
    [id],
  );
  if (!rows.length) {
    return null;
  }
  return toApplication(rows[0]);
}

/**
 * listByApplicantId service/controller utility.
 */
export async function listByApplicantId(
  applicantId: number,
  page: number,
  limit: number,
) {
  const pool = getPool();
  const offset = (page - 1) * limit;

  const [countRows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM applications WHERE applicant_id = ?',
    [applicantId],
  );
  const total = Number(countRows[0]?.total ?? 0);

  const [rows] = await pool.query<RowDataPacket[] & ApplicationListItem[]>(
    `SELECT a.id, a.program_id, a.status, a.created_at, p.id as program_id_join, p.name as program_name, p.level as program_level
     FROM applications a
     JOIN programs p ON p.id = a.program_id
     WHERE a.applicant_id = ?
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [applicantId, limit, offset],
  );

  const items = rows.map((row) => ({
    id: normalizeId(row.id as unknown as number),
    program_id: normalizeId(row.program_id as unknown as number),
    status: row.status as ApplicationListItem['status'],
    created_at: row.created_at as ApplicationListItem['created_at'],
    program: {
      id: normalizeId(row.program_id_join as unknown as number),
      name: row.program_name as string,
      level: row.program_level as 'undergraduate' | 'postgraduate',
    },
  }));

  return { items, total };
}
