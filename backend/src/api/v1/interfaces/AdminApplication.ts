export interface AdminApplicationListItem {
  id: number;
  status: 'submitted' | 'accepted' | 'rejected';
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: number | null;
  program: {
    id: number;
    name: string;
    level: 'undergraduate' | 'postgraduate';
  };
  applicant: {
    id: number;
    first_name: string;
    last_name: string;
    reference_code: string | null;
  };
}

export interface AdminApplicationDetail {
  id: number;
  status: 'submitted' | 'accepted' | 'rejected';
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: number | null;
  program: {
    id: number;
    name: string;
    level: 'undergraduate' | 'postgraduate';
  };
  applicant_profile: {
    id: number;
    user_id: number;
    reference_code: string | null;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    passport_no: string;
    id_no: string;
    place_of_birth: string;
    contact_number: string;
    country: string;
    address_line: string;
    city: string;
    state: string;
    zip_postcode: string;
    mother_full_name: string;
    father_full_name: string;
    heard_about_university: string;
    created_at: Date;
  };
}

export interface AdminApplicationReview {
  id: number;
  status: 'accepted' | 'rejected';
  reviewed_by: number;
  reviewed_at: Date;
}
