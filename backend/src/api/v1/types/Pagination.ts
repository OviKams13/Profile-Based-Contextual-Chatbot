/**
 * Shared TypeScript contracts used across API modules.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ProgramListQuery extends PaginationQuery {
  level?: 'undergraduate' | 'postgraduate';
  search?: string;
}
