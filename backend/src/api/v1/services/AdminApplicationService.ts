import { AppError } from '../helpers/AppError';
import { getPagination } from '../helpers/pagination';
import {
  AdminApplicationListFilters,
  findApplicationDetailById,
  findApplicationStatusById,
  listApplications,
  updateStatusReviewed,
} from '../models/AdminApplicationModel';

export async function listAdminApplications(
  filters: AdminApplicationListFilters,
  page?: number,
  limit?: number,
) {
  const pagination = getPagination(page, limit);
  const result = await listApplications(filters, pagination.page, pagination.limit);

  return {
    items: result.items,
    page: pagination.page,
    limit: pagination.limit,
    total: result.total,
  };
}

export async function getAdminApplicationDetail(id: number) {
  const application = await findApplicationDetailById(id);
  if (!application) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }
  return application;
}

async function reviewApplication(id: number, deanUserId: number, status: 'accepted' | 'rejected') {
  const existing = await findApplicationStatusById(id);
  if (!existing) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }
  if (existing.status !== 'submitted') {
    throw new AppError('Application already reviewed', 409, 'APPLICATION_ALREADY_REVIEWED');
  }

  const updated = await updateStatusReviewed(id, status, deanUserId);
  if (!updated) {
    throw new AppError('Application review failed', 500, 'APPLICATION_REVIEW_FAILED');
  }
  return updated;
}

export async function acceptApplication(id: number, deanUserId: number) {
  return reviewApplication(id, deanUserId, 'accepted');
}

export async function rejectApplication(id: number, deanUserId: number) {
  return reviewApplication(id, deanUserId, 'rejected');
}
