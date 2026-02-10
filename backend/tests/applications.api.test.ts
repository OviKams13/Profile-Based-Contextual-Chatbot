import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const applicantUser = {
  first_name: 'Applicant',
  last_name: 'Application',
  email: 'test_applicant_application@test.com',
  password: 'StrongPass123!',
  role: 'applicant' as const,
};

const deanUser = {
  first_name: 'Dean',
  last_name: 'Application',
  email: 'test_dean_application@test.com',
  password: 'StrongPass123!',
  role: 'dean' as const,
};

const programPayload = {
  name: 'Test Program - Application',
  level: 'undergraduate' as const,
  duration_years: 4,
  short_description: 'Program for application testing.',
  about_text: 'About the program for application tests.',
  entry_requirements_text: 'Entry requirements for application tests.',
  scholarships_text: 'Scholarships for application tests.',
};

const profilePayload = {
  first_name: 'Zeka',
  last_name: 'Shadrac',
  date_of_birth: '2002-01-01',
  gender: 'male',
  passport_no: 'P1234567',
  id_no: 'ID998877',
  place_of_birth: 'Nicosia',
  contact_number: '+90 5xx xxx xx xx',
  country: 'Cyprus',
  address_line: 'Street 1',
  city: 'Lefkosa',
  state: 'TRNC',
  zip_postcode: '99010',
  mother_full_name: 'Mother Name',
  father_full_name: 'Father Name',
  heard_about_university: 'Instagram',
};

// Ensures applicant submission flow and personal application listing stay protected by role.
describe('Applications API', () => {
  let applicantToken = '';
  let deanToken = '';
  let programId: number;

  beforeAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM applications WHERE applicant_id IN (SELECT id FROM applicant_profiles WHERE contact_number = ?)', [
      profilePayload.contact_number,
    ]);
    await pool.query('DELETE FROM applicant_profiles WHERE contact_number = ?', [
      profilePayload.contact_number,
    ]);
    await pool.query('DELETE FROM programs WHERE name LIKE ?', ['Test Program - Application%']);
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [
      applicantUser.email,
      deanUser.email,
    ]);

    await request(app).post('/api/v1/auth/register').send(applicantUser);
    await request(app).post('/api/v1/auth/register').send(deanUser);

    const applicantLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: applicantUser.email, password: applicantUser.password });
    applicantToken = applicantLogin.body.data.token;

    const deanLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: deanUser.email, password: deanUser.password });
    deanToken = deanLogin.body.data.token;

    const programResponse = await request(app)
      .post('/api/v1/programs')
      .set('Authorization', `Bearer ${deanToken}`)
      .send(programPayload);
    programId = programResponse.body.data.program.id;
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM applications WHERE applicant_id IN (SELECT id FROM applicant_profiles WHERE contact_number = ?)', [
      profilePayload.contact_number,
    ]);
    await pool.query('DELETE FROM applicant_profiles WHERE contact_number = ?', [
      profilePayload.contact_number,
    ]);
    await pool.query('DELETE FROM programs WHERE id = ?', [programId]);
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [
      applicantUser.email,
      deanUser.email,
    ]);
    await pool.end();
  });

  it('POST /applications without token -> 401', async () => {
    const response = await request(app)
      .post('/api/v1/applications')
      .send({ program_id: programId, profile: profilePayload });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('POST /applications with dean token -> 403', async () => {
    const response = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${deanToken}`)
      .send({ program_id: programId, profile: profilePayload });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('POST /applications with invalid program -> 404', async () => {
    const response = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({ program_id: 999999, profile: profilePayload });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('GET /applicant/profile still 404 after invalid program', async () => {
    const response = await request(app)
      .get('/api/v1/applicant/profile')
      .set('Authorization', `Bearer ${applicantToken}`);

    expect(response.status).toBe(404);
  });

  it('POST /applications with applicant token -> 201', async () => {
    const response = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({ program_id: programId, profile: profilePayload });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.application.program_id).toBe(programId);
    expect(response.body.data.application.status).toBe('submitted');
  });

  it('GET /applications/me -> 200 items>=1', async () => {
    const response = await request(app)
      .get('/api/v1/applications/me')
      .set('Authorization', `Bearer ${applicantToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items.length).toBeGreaterThan(0);
  });
});
