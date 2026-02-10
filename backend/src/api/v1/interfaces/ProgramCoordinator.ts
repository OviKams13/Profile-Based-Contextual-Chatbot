/**
 * Shared TypeScript contracts used across API modules.
 */
export interface ProgramCoordinator {
  id: number | bigint;
  full_name: string;
  email: string;
  picture: string | null;
  telephone_number: string | null;
  nationality: string | null;
  academic_qualification: string | null;
  speciality: string | null;
  office_location: string | null;
  office_hours: string | null;
  created_at: Date;
}
