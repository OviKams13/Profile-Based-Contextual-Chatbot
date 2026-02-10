/**
 * Shared TypeScript contracts used across API modules.
 */
export interface Program {
  id: number | bigint;
  created_by: number | bigint;
  program_coordinator_id: number | bigint | null;
  name: string;
  level: 'undergraduate' | 'postgraduate';
  duration_years: number;
  short_description: string;
  about_text: string;
  entry_requirements_text: string;
  scholarships_text: string;
  created_at: Date;
}
