export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

// Normalize pagination to prevent negative offsets and inconsistent page behavior.
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
