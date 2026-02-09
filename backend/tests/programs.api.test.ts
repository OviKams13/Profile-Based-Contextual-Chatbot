import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const deanUser = {
  first_name: 'Dean',
  last_name: 'Program',
  email: 'test_dean_programs@test.com',
  password: 'StrongPass123!',
  role: 'dean' as const,
};

const applicantUser = {
  first_name: 'Applicant',
  last_name: 'Program',
  email: 'test_applicant_programs@test.com',
  password: 'StrongPass123!',
  role: 'applicant' as const,
};

const programPayload = {
  name: 'Test Program - Software Engineering',
  level: 'undergraduate' as const,
  duration_years: 4,
  short_description: 'Build modern software systems with hands-on projects.',
  about_text: 'About program description for testing purposes.',
  entry_requirements_text: 'Requirements for entry include basic math.',
  scholarships_text: 'Scholarships available for top applicants.',
};

describe('Programs API', () => {
  let deanToken = '';
  let applicantToken = '';
  let programId: number;

  beforeAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM programs WHERE name LIKE ?', ['Test Program%']);
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [
      deanUser.email,
      applicantUser.email,
    ]);

    await request(app).post('/api/v1/auth/register').send(deanUser);
    await request(app).post('/api/v1/auth/register').send(applicantUser);

    const deanLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: deanUser.email, password: deanUser.password });
    deanToken = deanLogin.body.data.token;

    const applicantLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: applicantUser.email, password: applicantUser.password });
    applicantToken = applicantLogin.body.data.token;
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM programs WHERE name LIKE ?', ['Test Program%']);
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [
      deanUser.email,
      applicantUser.email,
    ]);
    await pool.end();
  });

  it('GET /programs returns list structure', async () => {
    const response = await request(app).get('/api/v1/programs');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
    expect(typeof response.body.data.page).toBe('number');
    expect(typeof response.body.data.limit).toBe('number');
    expect(typeof response.body.data.total).toBe('number');
  });

  it('POST /programs without token -> 401', async () => {
    const response = await request(app).post('/api/v1/programs').send(programPayload);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('POST /programs with applicant token -> 403', async () => {
    const response = await request(app)
      .post('/api/v1/programs')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send(programPayload);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('POST /programs with dean token -> 201', async () => {
    const response = await request(app)
      .post('/api/v1/programs')
      .set('Authorization', `Bearer ${deanToken}`)
      .send(programPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.program.name).toBe(programPayload.name);
    programId = response.body.data.program.id;
  });

  it('GET /programs/:id -> 200', async () => {
    const response = await request(app).get(`/api/v1/programs/${programId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.program.id).toBe(programId);
  });

  it('PUT /programs/:id without token -> 401', async () => {
    const response = await request(app)
      .put(`/api/v1/programs/${programId}`)
      .send({
        ...programPayload,
        name: 'Test Program - Updated',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('PUT /programs/:id with dean token -> 200', async () => {
    const response = await request(app)
      .put(`/api/v1/programs/${programId}`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...programPayload,
        name: 'Test Program - Updated',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.program.name).toBe('Test Program - Updated');
  });

  it('PUT /programs/:id not found -> 404', async () => {
    const response = await request(app)
      .put('/api/v1/programs/999999')
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...programPayload,
        name: 'Test Program - Updated 2',
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('POST /programs invalid body -> 400', async () => {
    const response = await request(app)
      .post('/api/v1/programs')
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        name: 'A',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
