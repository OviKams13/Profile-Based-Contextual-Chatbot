import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const deanUser = {
  first_name: 'Dean',
  last_name: 'Coordinator',
  email: 'test_dean_coordinator@test.com',
  password: 'StrongPass123!',
  role: 'dean' as const,
};

const applicantUser = {
  first_name: 'Applicant',
  last_name: 'Coordinator',
  email: 'test_applicant_coordinator@test.com',
  password: 'StrongPass123!',
  role: 'applicant' as const,
};

const coordinatorPayload = {
  full_name: 'Dr. John Smith',
  email: 'test_coordinator_1@university.edu',
  picture: 'https://example.com/pic.jpg',
  telephone_number: '+90 5xx xxx xx xx',
  nationality: 'Cyprus',
  academic_qualification: 'PhD',
  speciality: 'Software Engineering',
  office_location: 'Engineering Building, Room 203',
  office_hours: 'Mon-Fri 10:00-12:00',
};

// Verifies coordinator CRUD authorization and uniqueness constraints through API.
describe('Program Coordinators API', () => {
  let deanToken = '';
  let applicantToken = '';
  let coordinatorId: number;

  beforeAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM program_coordinators WHERE email LIKE ?', [
      'test_coordinator_%@university.edu',
    ]);
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
    await pool.query('DELETE FROM program_coordinators WHERE email LIKE ?', [
      'test_coordinator_%@university.edu',
    ]);
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [
      deanUser.email,
      applicantUser.email,
    ]);
    await pool.end();
  });

  it('GET coordinator not found -> 404', async () => {
    const response = await request(app).get('/api/v1/program-coordinators/999999');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('POST coordinator without token -> 401', async () => {
    const response = await request(app)
      .post('/api/v1/program-coordinators')
      .send(coordinatorPayload);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('POST coordinator with applicant token -> 403', async () => {
    const response = await request(app)
      .post('/api/v1/program-coordinators')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send(coordinatorPayload);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('POST coordinator with dean token -> 201', async () => {
    const response = await request(app)
      .post('/api/v1/program-coordinators')
      .set('Authorization', `Bearer ${deanToken}`)
      .send(coordinatorPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    coordinatorId = response.body.data.program_coordinator.id;
  });

  it('POST duplicate email -> 409', async () => {
    const response = await request(app)
      .post('/api/v1/program-coordinators')
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...coordinatorPayload,
        full_name: 'Dr. Jane Smith',
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('GET coordinator -> 200', async () => {
    const response = await request(app).get(`/api/v1/program-coordinators/${coordinatorId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('PUT coordinator -> 200 updated', async () => {
    const response = await request(app)
      .put(`/api/v1/program-coordinators/${coordinatorId}`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...coordinatorPayload,
        full_name: 'Dr. John Smith Updated',
        email: 'test_coordinator_1@university.edu',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('PUT coordinator change email to existing -> 409', async () => {
    const createResponse = await request(app)
      .post('/api/v1/program-coordinators')
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...coordinatorPayload,
        email: 'test_coordinator_2@university.edu',
      });

    const secondId = createResponse.body.data.program_coordinator.id;

    const response = await request(app)
      .put(`/api/v1/program-coordinators/${secondId}`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...coordinatorPayload,
        email: coordinatorPayload.email,
        full_name: 'Dr. Jane Smith',
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });
});
