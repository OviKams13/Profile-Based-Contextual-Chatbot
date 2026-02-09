import { AppError } from '../helpers/AppError';
import { getPagination } from '../helpers/pagination';
import { generateReferenceCode } from '../helpers/referenceCode';
import { getPool } from '../../../config/DatabaseConfig';
import {
  ApplicantProfileInput,
  findByUserId,
  findByUserIdForUpdate,
  insertProfile,
  updateProfile,
} from '../models/ApplicantProfileModel';
import { createApplication, findById, listByApplicantId } from '../models/ApplicationModel';
import { findById as findProgramById } from '../models/ProgramModel';

type ApplicantProfilePayload = Omit<ApplicantProfileInput, 'reference_code'>;

export async function submitApplication(
  userId: number,
  programId: number,
  profile: ApplicantProfilePayload,
) {
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const program = await findProgramById(programId);
    if (!program) {
      throw new AppError('Program not found', 404, 'PROGRAM_NOT_FOUND');
    }

    const existingProfile = await findByUserIdForUpdate(conn, userId);
    const reference_code = existingProfile?.reference_code ?? profile.reference_code ?? generateReferenceCode();

    if (existingProfile) {
      await updateProfile(conn, userId, {
        ...profile,
        reference_code,
      });
    } else {
      await insertProfile(conn, userId, {
        ...profile,
        reference_code,
      });
    }

    const refreshedProfile = await findByUserIdForUpdate(conn, userId);
    if (!refreshedProfile) {
      throw new AppError('Applicant profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const applicationId = await createApplication(conn, {
      applicant_id: Number(refreshedProfile.id),
      program_id: programId,
      status: 'submitted',
    });

    await conn.commit();

    const application = await findById(applicationId);
    if (!application) {
      throw new AppError('Application submission failed', 500, 'APPLICATION_CREATE_FAILED');
    }

    return { application, profile: refreshedProfile };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function listMyApplications(userId: number, page?: number, limit?: number) {
  const profile = await findByUserId(userId);
  if (!profile) {
    throw new AppError('Applicant profile not found', 404, 'PROFILE_NOT_FOUND');
  }

  const pagination = getPagination(page, limit);
  const result = await listByApplicantId(Number(profile.id), pagination.page, pagination.limit);

  return {
    items: result.items,
    page: pagination.page,
    limit: pagination.limit,
    total: result.total,
  };
}
