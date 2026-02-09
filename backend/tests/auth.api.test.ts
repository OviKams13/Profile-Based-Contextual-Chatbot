import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const testUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test_user_auth@test.com',
  password: 'StrongPass123!',
  role: 'applicant' as const,
};

describe('Auth API', () => {
  beforeAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM users WHERE email LIKE ?', ['test_%@test.com']);
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM users WHERE email LIKE ?', ['test_%@test.com']);
    await pool.end();
  });

  it('register success -> 201 + token + user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data.token).toBeTruthy();
  });

  it('register duplicate email -> 409', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...testUser,
        email: 'test_duplicate@test.com',
      });

    expect(response.status).toBe(201);

    const duplicateResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...testUser,
        email: 'test_duplicate@test.com',
      });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.success).toBe(false);
  });

  it('login success -> 200', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeTruthy();
  });

  it('login wrong password -> 401', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'WrongPass123!' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('GET /auth/me without token -> 401', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('GET /auth/me with token -> 200', async () => {
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
  });
});
