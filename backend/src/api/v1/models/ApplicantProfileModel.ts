import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { ApplicantProfile } from '../interfaces/ApplicantProfile';

export interface ApplicantProfileInput {
  reference_code: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  passport_no: string;
  id_no: string;
  place_of_birth: string;
  contact_number: string;
  country: string;
  address_line: string;
  city: string;
  state: string;
  zip_postcode: string;
  mother_full_name: string;
  father_full_name: string;
  heard_about_university: string;
}

function normalizeId(id: ApplicantProfile['id']): number {
  return typeof id === 'bigint' ? Number(id) : Number(id);
}

function toProfile(row: ApplicantProfile): ApplicantProfile {
  return {
    ...row,
    id: normalizeId(row.id),
    user_id: normalizeId(row.user_id),
  };
}

export async function findByUserId(userId: number): Promise<ApplicantProfile | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & ApplicantProfile[]>(
    'SELECT * FROM applicant_profiles WHERE user_id = ? LIMIT 1',
    [userId],
  );
  if (!rows.length) {
    return null;
  }
  return toProfile(rows[0]);
}

// FOR UPDATE lock protects profile upsert from race conditions on concurrent submissions.
export async function findByUserIdForUpdate(
  conn: PoolConnection,
  userId: number,
): Promise<ApplicantProfile | null> {
  const [rows] = await conn.query<RowDataPacket[] & ApplicantProfile[]>(
    'SELECT * FROM applicant_profiles WHERE user_id = ? LIMIT 1',
    [userId],
  );
  if (!rows.length) {
    return null;
  }
  return toProfile(rows[0]);
}

export async function insertProfile(
  conn: PoolConnection,
  userId: number,
  input: ApplicantProfileInput,
): Promise<number> {
  const [result] = await conn.query<ResultSetHeader>(
    `INSERT INTO applicant_profiles
      (user_id, reference_code, first_name, last_name, date_of_birth, gender, passport_no, id_no, place_of_birth, contact_number, country, address_line, city, state, zip_postcode, mother_full_name, father_full_name, heard_about_university)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      input.reference_code,
      input.first_name,
      input.last_name,
      input.date_of_birth,
      input.gender,
      input.passport_no,
      input.id_no,
      input.place_of_birth,
      input.contact_number,
      input.country,
      input.address_line,
      input.city,
      input.state,
      input.zip_postcode,
      input.mother_full_name,
      input.father_full_name,
      input.heard_about_university,
    ],
  );
  return result.insertId;
}

export async function updateProfile(
  conn: PoolConnection,
  userId: number,
  input: ApplicantProfileInput,
): Promise<boolean> {
  const [result] = await conn.query<ResultSetHeader>(
    `UPDATE applicant_profiles
     SET reference_code = ?, first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, passport_no = ?, id_no = ?, place_of_birth = ?, contact_number = ?, country = ?, address_line = ?, city = ?, state = ?, zip_postcode = ?, mother_full_name = ?, father_full_name = ?, heard_about_university = ?
     WHERE user_id = ?`,
    [
      input.reference_code,
      input.first_name,
      input.last_name,
      input.date_of_birth,
      input.gender,
      input.passport_no,
      input.id_no,
      input.place_of_birth,
      input.contact_number,
      input.country,
      input.address_line,
      input.city,
      input.state,
      input.zip_postcode,
      input.mother_full_name,
      input.father_full_name,
      input.heard_about_university,
      userId,
    ],
  );

  return result.affectedRows > 0;
}
