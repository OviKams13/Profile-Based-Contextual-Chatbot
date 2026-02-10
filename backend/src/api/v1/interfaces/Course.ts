/**
 * Shared TypeScript contracts used across API modules.
 */
export interface Course {
  id: number | bigint;
  program_id: number | bigint;
  created_by?: number | bigint | null;
  year_number: number;
  course_name: string;
  course_code: string;
  credits: number;
  theoretical_hours: number;
  practical_hours: number;
  distance_hours: number;
  ects: number;
  course_description: string;
  created_at: Date;
}
