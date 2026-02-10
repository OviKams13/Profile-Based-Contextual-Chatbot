/**
 * Application configuration and infrastructure bootstrap helpers.
 */
import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;

/**
 * getPool service/controller utility.
 */
export function getPool(): Pool {
  if (pool) return pool;

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
  const connectionLimit = process.env.DB_CONNECTION_LIMIT
    ? Number(process.env.DB_CONNECTION_LIMIT)
    : 10;

  if (!host || !user || !database) {
    throw new Error('Missing DB env vars. Check DB_HOST, DB_USER, DB_NAME in .env');
  }

  pool = createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit,
    queueLimit: 0,
  });

  return pool;
}

/**
 * testDbConnection service/controller utility.
 */
export async function testDbConnection(): Promise<void> {
  const p = getPool();
  const conn = await p.getConnection();
  try {
    await conn.query('SELECT 1');
  } finally {
    conn.release();
  }
}
