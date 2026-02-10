/**
 * Shared helper utilities for reusable API behavior and transformations.
 */
export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

/**
 * getPagination service/controller utility.
 */
export function getPagination(page?: number, limit?: number): PaginationResult {
  const normalizedPage = page && page > 0 ? Math.floor(page) : 1;
  const normalizedLimit = limit && limit > 0 ? Math.floor(limit) : 10;
  const offset = (normalizedPage - 1) * normalizedLimit;
  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset,
  };
}
