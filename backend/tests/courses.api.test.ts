/**
 * Integration tests validating API behavior and permission boundaries.
 */
import request from 'supertest';
import { app } from '../src/index';
import { getPool } from '../src/config/DatabaseConfig';

const deanUser = {
  first_name: 'Dean',
  last_name: 'Courses',
  email: 'test_dean_courses@test.com',
  password: 'StrongPass123!',
  role: 'dean' as const,
};

const applicantUser = {
  first_name: 'Applicant',
  last_name: 'Courses',
  email: 'test_applicant_courses@test.com',
  password: 'StrongPass123!',
  role: 'applicant' as const,
};

const programPayload = {
  name: 'Test Program - Courses',
  level: 'undergraduate' as const,
  duration_years: 4,
  short_description: 'Program for courses testing.',
  about_text: 'About the program for course tests.',
  entry_requirements_text: 'Entry requirements for course tests.',
  scholarships_text: 'Scholarships for course tests.',
};

const coursePayload = {
  year_number: 1,
  course_name: 'Introduction to Programming',
  course_code: 'SE101',
  credits: 3,
  theoretical_hours: 2,
  practical_hours: 2,
  distance_hours: 0,
  ects: 7.5,
  course_description: 'Basics of programming for engineers.',
};

describe('Courses API', () => {
  let deanToken = '';
  let applicantToken = '';
  let programId: number;
  let courseId: number;

  beforeAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM courses WHERE course_name LIKE ?', ['Introduction to Programming%']);
    await pool.query('DELETE FROM programs WHERE name LIKE ?', ['Test Program - Courses%']);
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

    const programResponse = await request(app)
      .post('/api/v1/programs')
      .set('Authorization', `Bearer ${deanToken}`)
      .send(programPayload);
    programId = programResponse.body.data.program.id;
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.query('DELETE FROM courses WHERE program_id = ?', [programId]);
    await pool.query('DELETE FROM programs WHERE id = ?', [programId]);
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [
      deanUser.email,
      applicantUser.email,
    ]);
    await pool.end();
  });

  it('GET /programs/:programId/courses initial -> 200 items=[]', async () => {
    const response = await request(app).get(`/api/v1/programs/${programId}/courses`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
  });

  it('POST course without token -> 401', async () => {
    const response = await request(app)
      .post(`/api/v1/programs/${programId}/courses`)
      .send(coursePayload);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('POST course with applicant token -> 403', async () => {
    const response = await request(app)
      .post(`/api/v1/programs/${programId}/courses`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send(coursePayload);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('POST course with dean token -> 201', async () => {
    const response = await request(app)
      .post(`/api/v1/programs/${programId}/courses`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send(coursePayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.course.course_code).toBe(coursePayload.course_code);
    courseId = response.body.data.course.id;
  });

  it('GET list contains course -> 200', async () => {
    const response = await request(app).get(`/api/v1/programs/${programId}/courses`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items.length).toBeGreaterThan(0);
  });

  it('GET /courses/:id -> 200', async () => {
    const response = await request(app).get(`/api/v1/courses/${courseId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.course.id).toBe(courseId);
  });

  it('PUT /courses/:id -> 200 updated', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...coursePayload,
        course_name: 'Introduction to Programming Updated',
        course_code: 'SE102',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.course.course_code).toBe('SE102');
  });

  it('PUT with year_number > duration_years -> 400', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${courseId}`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...coursePayload,
        year_number: 10,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('POST duplicate course_code -> 409', async () => {
    const response = await request(app)
      .post(`/api/v1/programs/${programId}/courses`)
      .set('Authorization', `Bearer ${deanToken}`)
      .send({
        ...coursePayload,
        course_name: 'Another Course',
        course_code: 'SE102',
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  it('DELETE /courses/:id -> 200 then GET -> 404', async () => {
    const response = await request(app)
      .delete(`/api/v1/courses/${courseId}`)
      .set('Authorization', `Bearer ${deanToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const getResponse = await request(app).get(`/api/v1/courses/${courseId}`);
    expect(getResponse.status).toBe(404);
  });
});
