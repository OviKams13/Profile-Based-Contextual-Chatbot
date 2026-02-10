import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const applicantUser = {
  first_name: 'Applicant',
  last_name: 'AdminReview',
  email: 'test_applicant_admin_review@test.com',
  password: 'StrongPass123!',
  role: 'applicant' as const,
};

const deanUser = {
  first_name: 'Dean',
  last_name: 'AdminReview',
  email: 'test_dean_admin_review@test.com',
  password: 'StrongPass123!',
  role: 'dean' as const,
};

const programPayload = {
  name: 'Test Program - Admin Review',
  level: 'undergraduate' as const,
  duration_years: 4,
  short_description: 'Program for admin review tests.',
  about_text: 'About the program for admin review tests.',
  entry_requirements_text: 'Entry requirements for admin review tests.',
  scholarships_text: 'Scholarships for admin review tests.',
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

// Covers dean inbox permissions, filtering, detail loading, and one-way review decisions.
describe('Admin Applications API', () => {
  let applicantToken = '';
  let deanToken = '';
  let deanId = 0;
  let programId = 0;
  let applicationId = 0;

  beforeAll(async () => {
    const pool = getPool();
    await pool.query(
      'DELETE FROM applications WHERE applicant_id IN (SELECT id FROM applicant_profiles WHERE contact_number = ?)',
      [profilePayload.contact_number],
    );
    await pool.query('DELETE FROM applicant_profiles WHERE contact_number = ?', [
      profilePayload.contact_number,
    ]);
    await pool.query('DELETE FROM programs WHERE name LIKE ?', ['Test Program - Admin Review%']);
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
    deanId = deanLogin.body.data.user.id;

    const programResponse = await request(app)
      .post('/api/v1/programs')
      .set('Authorization', `Bearer ${deanToken}`)
      .send(programPayload);
    programId = programResponse.body.data.program.id;

    const applicationResponse = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({ program_id: programId, profile: profilePayload });
    applicationId = applicationResponse.body.data.application.id;
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM applications WHERE id = ?', [applicationId]);
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

  it('GET /admin/applications without token -> 401', async () => {
    const response = await request(app).get('/api/v1/admin/applications');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('GET /admin/applications with applicant token -> 403', async () => {
    const response = await request(app)
      .get('/api/v1/admin/applications')
      .set('Authorization', `Bearer ${applicantToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('GET /admin/applications with dean token -> 200', async () => {
    const response = await request(app)
      .get('/api/v1/admin/applications')
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items.length).toBeGreaterThan(0);
  });

  it('GET /admin/applications?status=submitted -> 200', async () => {
    const response = await request(app)
      .get('/api/v1/admin/applications')
      .query({ status: 'submitted' })
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items.length).toBeGreaterThan(0);
  });

  it('GET /admin/applications/:id -> 200 with profile', async () => {
    const response = await request(app)
      .get(`/api/v1/admin/applications/${applicationId}`)
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.application.applicant_profile.first_name).toBe(profilePayload.first_name);
  });

  it('PATCH /admin/applications/:id/accept -> 200', async () => {
    const response = await request(app)
      .patch(`/api/v1/admin/applications/${applicationId}/accept`)
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.application.status).toBe('accepted');
    expect(response.body.data.application.reviewed_by).toBe(deanId);
  });

  it('PATCH /admin/applications/:id/reject after accept -> 409', async () => {
    const response = await request(app)
      .patch(`/api/v1/admin/applications/${applicationId}/reject`)
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('PATCH /admin/applications/:id/accept not found -> 404', async () => {
    const response = await request(app)
      .patch('/api/v1/admin/applications/999999/accept')
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('GET /admin/applications pagination structure -> 200', async () => {
    const response = await request(app)
      .get('/api/v1/admin/applications')
      .query({ page: 1, limit: 5 })
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.page).toBe(1);
    expect(response.body.data.limit).toBe(5);
  });
});
