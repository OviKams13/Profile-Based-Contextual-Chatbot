import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const deanUser = {
  first_name: 'Dean',
  last_name: 'Assign',
  email: 'test_dean_assign@test.com',
  password: 'StrongPass123!',
  role: 'dean' as const,
};

const programPayload = {
  name: 'Test Program - Assign',
  level: 'undergraduate' as const,
  duration_years: 4,
  short_description: 'Program for coordinator assign testing.',
  about_text: 'About the program for coordinator assign tests.',
  entry_requirements_text: 'Entry requirements for coordinator assign tests.',
  scholarships_text: 'Scholarships for coordinator assign tests.',
};

const coordinatorPayload = {
  full_name: 'Dr. Assign Coordinator',
  email: 'test_coordinator_assign@university.edu',
  picture: 'https://example.com/pic.jpg',
  telephone_number: '+90 5xx xxx xx xx',
  nationality: 'Cyprus',
  academic_qualification: 'PhD',
  speciality: 'Software Engineering',
  office_location: 'Engineering Building, Room 203',
  office_hours: 'Mon-Fri 10:00-12:00',
};

// Verifies coordinator assignment endpoint authorization and validation scenarios.
describe('Assign Coordinator API', () => {
  let deanToken = '';
  let programId: number;
  let coordinatorId: number;

  beforeAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM program_coordinators WHERE email LIKE ?', [
      'test_coordinator_assign%@university.edu',
    ]);
    await pool.query('DELETE FROM programs WHERE name LIKE ?', ['Test Program - Assign%']);
    await pool.query('DELETE FROM users WHERE email IN (?)', [deanUser.email]);

    await request(app).post('/api/v1/auth/register').send(deanUser);

    const deanLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: deanUser.email, password: deanUser.password });
    deanToken = deanLogin.body.data.token;

    const programResponse = await request(app)
      .post('/api/v1/programs')
      .set('Authorization', `Bearer ${deanToken}`)
      .send(programPayload);
    programId = programResponse.body.data.program.id;

    const coordinatorResponse = await request(app)
      .post('/api/v1/program-coordinators')
      .set('Authorization', `Bearer ${deanToken}`)
      .send(coordinatorPayload);
    coordinatorId = coordinatorResponse.body.data.program_coordinator.id;
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM programs WHERE id = ?', [programId]);
    await pool.query('DELETE FROM program_coordinators WHERE id = ?', [coordinatorId]);
    await pool.query('DELETE FROM users WHERE email IN (?)', [deanUser.email]);
    await pool.end();
  });

  it('PATCH assign without token -> 401', async () => {
    const response = await request(app)
      .patch(`/api/v1/programs/${programId}/assign-coordinator`)
      .send({ program_coordinator_id: coordinatorId });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('PATCH assign dean -> 200', async () => {
    const response = await request(app)
      .patch(`/api/v1/programs/${programId}/assign-coordinator`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({ program_coordinator_id: coordinatorId });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.program.program_coordinator_id).toBe(coordinatorId);
  });

  it('PATCH assign coordinator not found -> 404', async () => {
    const response = await request(app)
      .patch(`/api/v1/programs/${programId}/assign-coordinator`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({ program_coordinator_id: 999999 });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('PATCH assign program not found -> 404', async () => {
    const response = await request(app)
      .patch('/api/v1/programs/999999/assign-coordinator')
      .set('Authorization', `Bearer ${deanToken}`)
      .send({ program_coordinator_id: coordinatorId });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('PATCH unassign -> 200', async () => {
    const response = await request(app)
      .patch(`/api/v1/programs/${programId}/assign-coordinator`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({ program_coordinator_id: null });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.program.program_coordinator_id).toBeNull();
  });
});
