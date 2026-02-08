import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection, getPool } from './config/DatabaseConfig';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    //check DB
    const pool = getPool();
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'ok', message: 'UniApply backend is running' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'down', message: 'DB connection failed' });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

async function start() {
  try {
    await testDbConnection();
    console.log('MySQL connected');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err: any) {
    console.error('MySQL connection error:', err?.message || err);
    process.exit(1);
  }
}

start();