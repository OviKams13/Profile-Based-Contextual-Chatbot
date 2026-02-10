import { http } from './http';

export interface ApplicantProfilePayload {
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
}

export async function getApplicantProfile() {
  const res = await http.get('/applicant/profile');
  return res.data.data.profile;
}

export async function updateApplicantProfile(payload: ApplicantProfilePayload) {
  const res = await http.put('/applicant/profile', payload);
  return res.data.data.profile;
}

export async function submitApplication(program_id: number, profile: ApplicantProfilePayload) {
  const res = await http.post('/applications', { program_id, profile });
  return res.data.data;
}

export async function getMyApplications() {
  const res = await http.get('/applications/me');
  return res.data.data as { items: Array<{ id: number; status: string; created_at: string; program: { name: string } }>; total: number };
}
