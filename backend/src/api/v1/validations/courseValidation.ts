/**
 * Zod schemas used to validate incoming API payloads and query parameters.
 */
import { z } from 'zod';

const courseBaseSchema = z
  .object({
    year_number: z
      .number({ invalid_type_error: 'Year number must be a number' })
      .int({ message: 'Year number must be an integer' })
      .min(1, { message: 'Year number must be at least 1' }),
    course_name: z
      .string()
      .trim()
      .min(2, { message: 'Course name must be at least 2 characters' })
      .max(150, { message: 'Course name must be at most 150 characters' }),
    course_code: z
      .string()
      .trim()
      .min(2, { message: 'Course code must be at least 2 characters' })
      .max(30, { message: 'Course code must be at most 30 characters' }),
    credits: z
      .number({ invalid_type_error: 'Credits must be a number' })
      .min(0, { message: 'Credits must be at least 0' }),
    theoretical_hours: z
      .number({ invalid_type_error: 'Theoretical hours must be a number' })
      .int({ message: 'Theoretical hours must be an integer' })
      .min(0, { message: 'Theoretical hours must be at least 0' }),
    practical_hours: z
      .number({ invalid_type_error: 'Practical hours must be a number' })
      .int({ message: 'Practical hours must be an integer' })
      .min(0, { message: 'Practical hours must be at least 0' }),
    distance_hours: z
      .number({ invalid_type_error: 'Distance hours must be a number' })
      .int({ message: 'Distance hours must be an integer' })
      .min(0, { message: 'Distance hours must be at least 0' }),
    ects: z
      .number({ invalid_type_error: 'ECTS must be a number' })
      .positive({ message: 'ECTS must be greater than 0' })
      .optional(),
    course_description: z
      .string()
      .trim()
      .min(5, { message: 'Course description must be at least 5 characters' }),
  })
  .strict();

export const createCourseSchema = z.object({
  body: courseBaseSchema,
});

export const updateCourseSchema = z.object({
  body: courseBaseSchema,
});

export const programIdSchema = z.object({
  params: z.object({
    programId: z.coerce.number().int().min(1),
  }),
});

export const courseIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().min(1),
  }),
});

export const listCoursesSchema = z.object({
  query: z
    .object({
      year: z.coerce.number().int().min(1).optional(),
      sort: z.enum(['year', 'name']).optional(),
    })
    .strict(),
});
