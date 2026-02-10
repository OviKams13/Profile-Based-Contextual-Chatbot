import { http } from './http';

export interface Course {
  id: number;
  program_id: number;
  year_number: number;
  course_name: string;
  course_code: string;
  credits: number;
  theoretical_hours: number;
  practical_hours: number;
  distance_hours: number;
  ects: number;
  course_description: string;
}

export type CoursePayload = Omit<Course, 'id' | 'program_id'>;

export async function listProgramCourses(programId: number) {
  const res = await http.get(`/programs/${programId}/courses`);
  return res.data.data.items as Course[];
}

export async function getCourse(id: number) {
  const res = await http.get(`/courses/${id}`);
  return res.data.data.course as Course;
}

export async function createCourse(programId: number, payload: CoursePayload) {
  const res = await http.post(`/programs/${programId}/courses`, payload);
  return res.data.data.course as Course;
}

export async function updateCourse(id: number, payload: CoursePayload) {
  const res = await http.put(`/courses/${id}`, payload);
  return res.data.data.course as Course;
}

export async function deleteCourse(id: number) {
  const res = await http.delete(`/courses/${id}`);
  return res.data.data;
}
