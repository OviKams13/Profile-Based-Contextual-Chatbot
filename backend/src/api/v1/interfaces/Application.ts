export interface Application {
  id: number | bigint;
  applicant_id: number | bigint;
  program_id: number | bigint;
  created_by: number | bigint;
  status: 'submitted' | 'accepted' | 'rejected';
  reviewed_by: number | bigint | null;
  reviewed_at: Date | null;
  created_at: Date;
}

export interface ApplicationListItem {
  id: number;
  program_id: number;
  status: 'submitted' | 'accepted' | 'rejected';
  created_at: Date;
  program?: {
    id: number;
    name: string;
    level: 'undergraduate' | 'postgraduate';
  };
}
