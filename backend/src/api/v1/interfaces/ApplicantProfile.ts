export interface ApplicantProfile {
  id: number | bigint;
  user_id: number | bigint;
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
}
