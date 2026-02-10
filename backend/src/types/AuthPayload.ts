/**
 * Shared TypeScript contracts used across API modules.
 */
export interface AuthPayload {
  id: number;
  email: string;
  role: 'dean' | 'applicant';
}
