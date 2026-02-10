import { http } from './http';

export interface Coordinator {
  id: number;
  full_name: string;
  email: string;
  picture?: string | null;
  telephone_number?: string | null;
  nationality?: string | null;
  academic_qualification?: string | null;
  speciality?: string | null;
  office_location?: string | null;
  office_hours?: string | null;
}

export type CoordinatorPayload = Omit<Coordinator, 'id'>;

export async function getCoordinator(id: number) {
  const res = await http.get(`/program-coordinators/${id}`);
  return res.data.data.program_coordinator as Coordinator;
}

export async function createCoordinator(payload: CoordinatorPayload) {
  const res = await http.post('/program-coordinators', payload);
  return res.data.data.program_coordinator as Coordinator;
}

export async function updateCoordinator(id: number, payload: CoordinatorPayload) {
  const res = await http.put(`/program-coordinators/${id}`, payload);
  return res.data.data.program_coordinator as Coordinator;
}
