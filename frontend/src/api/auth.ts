import { http } from './http';

export type Role = 'dean' | 'applicant';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function register(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
}) {
  const res = await http.post('/auth/register', payload);
  return res.data.data as AuthResponse;
}

export async function login(payload: { email: string; password: string }) {
  const res = await http.post('/auth/login', payload);
  return res.data.data as AuthResponse;
}

export async function me() {
  const res = await http.get('/auth/me');
  return res.data.data.user as User;
}
