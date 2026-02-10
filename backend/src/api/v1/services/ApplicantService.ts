import { AppError } from '../helpers/AppError';
import { generateReferenceCode } from '../helpers/referenceCode';
import {
  ApplicantProfileInput,
  findByUserId,
  findByUserIdForUpdate,
  insertProfile,
  updateProfile,
} from '../models/ApplicantProfileModel';
import { getPool } from '../../../config/DatabaseConfig';

// Loads applicant profile bound to authenticated applicant account.
export async function getProfile(userId: number) {
  const profile = await findByUserId(userId);
  if (!profile) {
    throw new AppError('Applicant profile not found', 404, 'PROFILE_NOT_FOUND');
  }
  return profile;
}

type ApplicantProfilePayload = Omit<ApplicantProfileInput, 'reference_code'>;

// Upserts a single applicant profile row with transactional safety.
export async function upsertProfile(userId: number, dto: ApplicantProfilePayload) {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    // Applicant profile writes run in a transaction to keep a stable single profile per user.
    await conn.beginTransaction();

    const existing = await findByUserIdForUpdate(conn, userId);
    const reference_code = existing?.reference_code ?? dto.reference_code ?? generateReferenceCode();
    if (existing) {
      await updateProfile(conn, userId, {
        ...dto,
        reference_code,
      });
    } else {
      await insertProfile(conn, userId, {
        ...dto,
        reference_code,
      });
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  const profile = await findByUserId(userId);
  if (!profile) {
    throw new AppError('Applicant profile not found', 404, 'PROFILE_NOT_FOUND');
  }
  return profile;
}
