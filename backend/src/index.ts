import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection, getPool } from './config/DatabaseConfig';
import v1Router from './api/v1/routes';
import { notFound } from './api/v1/middlewares/notFound';
import { errorHandler } from './api/v1/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

dotenv.config();

export const app = express();

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', v1Router);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

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

if (process.env.NODE_ENV !== 'test') {
  start();
}
