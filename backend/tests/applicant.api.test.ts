import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const applicantUser = {
  first_name: 'Applicant',
  last_name: 'Profile',
  email: 'test_applicant_profile@test.com',
  password: 'StrongPass123!',
  role: 'applicant' as const,
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

// Verifies applicant profile endpoint protections and upsert behavior end-to-end.
describe('Applicant Profile API', () => {
  let applicantToken = '';

  beforeAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM applicant_profiles WHERE contact_number = ?', [
      profilePayload.contact_number,
    ]);
    await pool.query('DELETE FROM users WHERE email = ?', [applicantUser.email]);

    await request(app).post('/api/v1/auth/register').send(applicantUser);

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: applicantUser.email, password: applicantUser.password });
    applicantToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM applicant_profiles WHERE contact_number = ?', [
      profilePayload.contact_number,
    ]);
    await pool.query('DELETE FROM users WHERE email = ?', [applicantUser.email]);
    await pool.end();
  });

  it('GET /applicant/profile without profile -> 404', async () => {
    const response = await request(app)
      .get('/api/v1/applicant/profile')
      .set('Authorization', `Bearer ${applicantToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it('PUT /applicant/profile -> 200', async () => {
    const response = await request(app)
      .put('/api/v1/applicant/profile')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send(profilePayload);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.profile.first_name).toBe(profilePayload.first_name);
  });

  it('GET /applicant/profile -> 200', async () => {
    const response = await request(app)
      .get('/api/v1/applicant/profile')
      .set('Authorization', `Bearer ${applicantToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.profile.last_name).toBe(profilePayload.last_name);
  });
});
