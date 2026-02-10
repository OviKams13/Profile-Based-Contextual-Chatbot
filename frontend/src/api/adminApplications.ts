import { http } from './http';

export async function listAdminApplications(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  program_id?: number;
}) {
  const res = await http.get('/admin/applications', { params });
  return res.data.data;
}

export async function getAdminApplication(id: number) {
  const res = await http.get(`/admin/applications/${id}`);
  return res.data.data.application;
}

export async function acceptApplication(id: number) {
  const res = await http.patch(`/admin/applications/${id}/accept`);
  return res.data.data.application;
}

export async function rejectApplication(id: number) {
  const res = await http.patch(`/admin/applications/${id}/reject`);
  return res.data.data.application;
}
