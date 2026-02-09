import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../../../config/DatabaseConfig';
import { User } from '../../../interfaces/User';

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: 'dean' | 'applicant';
}

export async function findByEmail(email: string): Promise<User | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & User[]>(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email],
  );
  return rows.length ? rows[0] : null;
}

export async function findById(id: number): Promise<User | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[] & User[]>(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return rows.length ? rows[0] : null;
}

export async function createUser(input: CreateUserInput): Promise<number> {
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [input.first_name, input.last_name, input.email, input.password_hash, input.role],
  );
  return result.insertId;
}
