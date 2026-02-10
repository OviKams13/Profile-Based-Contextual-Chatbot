import { RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { AdminApplicationDetail, AdminApplicationListItem, AdminApplicationReview } from '../interfaces/AdminApplication';

export interface AdminApplicationListFilters {
  status?: 'submitted' | 'accepted' | 'rejected';
  programId?: number;
  search?: string;
  sort?: 'created_at_desc' | 'created_at_asc';
}

export interface AdminApplicationListResult {
  items: AdminApplicationListItem[];
  total: number;
}

export interface ApplicationStatusRow {
  id: number | bigint;
  status: 'submitted' | 'accepted' | 'rejected';
}

function normalizeId(id: number | bigint | null): number | null {
  if (id === null) {
    return null;
  }
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

// Build parameterized filters for admin inbox without exposing SQL injection surfaces.
function buildWhereClause(filters: AdminApplicationListFilters) {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (filters.status) {
    conditions.push('a.status = ?');
    params.push(filters.status);
  }

  if (filters.programId) {
    conditions.push('a.program_id = ?');
    params.push(filters.programId);
  }

  if (filters.search) {
    conditions.push('(ap.first_name LIKE ? OR ap.last_name LIKE ? OR p.name LIKE ?)');
    const likeTerm = `%${filters.search}%`;
    params.push(likeTerm, likeTerm, likeTerm);
  }

  const clause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { clause, params };
}

export async function listApplications(
  filters: AdminApplicationListFilters,
  page: number,
  limit: number,
): Promise<AdminApplicationListResult> {
  const pool = getPool();
  const offset = (page - 1) * limit;
  const { clause, params } = buildWhereClause(filters);
  const sortDirection = filters.sort === 'created_at_asc' ? 'ASC' : 'DESC';

  // Total count uses identical filters so pagination metadata always matches returned rows.
  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total
     FROM applications a
     JOIN programs p ON p.id = a.program_id
     JOIN applicant_profiles ap ON ap.id = a.applicant_id
     ${clause}`,
    params,
  );
  const total = Number(countRows[0]?.total ?? 0);

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT a.id as application_id,
            a.status,
            a.created_at,
            a.reviewed_at,
            a.reviewed_by,
            p.id as program_id,
            p.name as program_name,
            p.level as program_level,
            ap.id as applicant_id,
            ap.first_name,
            ap.last_name,
            ap.reference_code
     FROM applications a
     JOIN programs p ON p.id = a.program_id
     JOIN applicant_profiles ap ON ap.id = a.applicant_id
     ${clause}
     ORDER BY a.created_at ${sortDirection}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const items = rows.map((row) => ({
    id: Number(row.application_id),
    status: row.status as AdminApplicationListItem['status'],
    created_at: row.created_at as Date,
    reviewed_at: row.reviewed_at as Date | null,
    reviewed_by: normalizeId(row.reviewed_by as number | bigint | null),
    program: {
      id: Number(row.program_id),
      name: row.program_name as string,
      level: row.program_level as 'undergraduate' | 'postgraduate',
    },
    applicant: {
      id: Number(row.applicant_id),
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      reference_code: row.reference_code as string | null,
    },
  }));

  return { items, total };
}

export async function findApplicationDetailById(id: number): Promise<AdminApplicationDetail | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT a.id as application_id,
            a.status,
            a.created_at,
            a.reviewed_at,
            a.reviewed_by,
            p.id as program_id,
            p.name as program_name,
            p.level as program_level,
            ap.id as applicant_id,
            ap.user_id,
            ap.reference_code,
            ap.first_name,
            ap.last_name,
            ap.date_of_birth,
            ap.gender,
            ap.passport_no,
            ap.id_no,
            ap.place_of_birth,
            ap.contact_number,
            ap.country,
            ap.address_line,
            ap.city,
            ap.state,
            ap.zip_postcode,
            ap.mother_full_name,
            ap.father_full_name,
            ap.heard_about_university,
            ap.created_at as applicant_created_at
     FROM applications a
     JOIN programs p ON p.id = a.program_id
     JOIN applicant_profiles ap ON ap.id = a.applicant_id
     WHERE a.id = ?
     LIMIT 1`,
    [id],
  );

  if (!rows.length) {
    return null;
  }

  const row = rows[0];

  return {
    id: Number(row.application_id),
    status: row.status as AdminApplicationDetail['status'],
    created_at: row.created_at as Date,
    reviewed_at: row.reviewed_at as Date | null,
    reviewed_by: normalizeId(row.reviewed_by as number | bigint | null),
    program: {
      id: Number(row.program_id),
      name: row.program_name as string,
      level: row.program_level as 'undergraduate' | 'postgraduate',
    },
    applicant_profile: {
      id: Number(row.applicant_id),
      user_id: Number(row.user_id),
      reference_code: row.reference_code as string | null,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      date_of_birth: row.date_of_birth as string,
      gender: row.gender as string,
      passport_no: row.passport_no as string,
      id_no: row.id_no as string,
      place_of_birth: row.place_of_birth as string,
      contact_number: row.contact_number as string,
      country: row.country as string,
      address_line: row.address_line as string,
      city: row.city as string,
      state: row.state as string,
      zip_postcode: row.zip_postcode as string,
      mother_full_name: row.mother_full_name as string,
      father_full_name: row.father_full_name as string,
      heard_about_university: row.heard_about_university as string,
      created_at: row.applicant_created_at as Date,
    },
  };
}

export async function findApplicationStatusById(id: number): Promise<ApplicationStatusRow | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, status FROM applications WHERE id = ? LIMIT 1',
    [id],
  );
  if (!rows.length) {
    return null;
  }
  return {
    id: rows[0].id as number | bigint,
    status: rows[0].status as ApplicationStatusRow['status'],
  };
}

export async function updateStatusReviewed(
  id: number,
  status: 'accepted' | 'rejected',
  reviewedBy: number,
): Promise<AdminApplicationReview | null> {
  const pool = getPool();
  // Review stores dean id and timestamp for admissions audit traceability.
  await pool.query(
    'UPDATE applications SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
    [status, reviewedBy, id],
  );

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, status, reviewed_by, reviewed_at FROM applications WHERE id = ? LIMIT 1',
    [id],
  );

  if (!rows.length) {
    return null;
  }

  return {
    id: Number(rows[0].id),
    status: rows[0].status as AdminApplicationReview['status'],
    reviewed_by: Number(rows[0].reviewed_by),
    reviewed_at: rows[0].reviewed_at as Date,
  };
}
