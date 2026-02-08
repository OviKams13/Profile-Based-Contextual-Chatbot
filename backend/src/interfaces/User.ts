export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'dean' | 'applicant';
  first_name: string;
  last_name: string;
  created_at: Date;
}

export type PublicUser = Omit<User, 'password_hash'>;
