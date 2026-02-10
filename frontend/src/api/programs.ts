import { http } from './http';

export interface Program {
  id: number;
  created_by: number;
  program_coordinator_id: number | null;
  name: string;
  level: 'undergraduate' | 'postgraduate';
  duration_years: number;
  short_description: string;
  about_text: string;
  entry_requirements_text: string;
  scholarships_text: string;
}

export interface ProgramPayload {
  name: string;
  level: 'undergraduate' | 'postgraduate';
  duration_years: number;
  short_description: string;
  about_text: string;
  entry_requirements_text: string;
  scholarships_text: string;
}

export async function listPrograms(params?: { search?: string; level?: string }) {
  const res = await http.get('/programs', { params });
  return res.data.data as { items: Program[]; total: number; page: number; limit: number };
}

export async function getProgram(id: number) {
  const res = await http.get(`/programs/${id}`);
  return res.data.data.program as Program;
}

export async function createProgram(payload: ProgramPayload) {
  const res = await http.post('/programs', payload);
  return res.data.data.program as Program;
}

export async function updateProgram(id: number, payload: ProgramPayload) {
  const res = await http.put(`/programs/${id}`, payload);
  return res.data.data.program as Program;
}

export async function assignCoordinator(programId: number, program_coordinator_id: number | null) {
  const res = await http.patch(`/programs/${programId}/assign-coordinator`, { program_coordinator_id });
  return res.data.data;
}
