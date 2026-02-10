import { z } from 'zod';

const coordinatorBaseSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, { message: 'Full name must be at least 2 characters' })
      .max(150, { message: 'Full name must be at most 150 characters' }),
    email: z
      .string()
      .trim()
      .email({ message: 'Invalid email address' })
      .transform((value) => value.toLowerCase()),
    picture: z.string().trim().max(255, { message: 'Picture must be at most 255 characters' }).optional(),
    telephone_number: z
      .string()
      .trim()
      .max(50, { message: 'Telephone number must be at most 50 characters' })
      .optional(),
    nationality: z
      .string()
      .trim()
      .max(80, { message: 'Nationality must be at most 80 characters' })
      .optional(),
    academic_qualification: z
      .string()
      .trim()
      .max(120, { message: 'Academic qualification must be at most 120 characters' })
      .optional(),
    speciality: z
      .string()
      .trim()
      .max(120, { message: 'Speciality must be at most 120 characters' })
      .optional(),
    office_location: z
      .string()
      .trim()
      .max(150, { message: 'Office location must be at most 150 characters' })
      .optional(),
    office_hours: z
      .string()
      .trim()
      .max(150, { message: 'Office hours must be at most 150 characters' })
      .optional(),
  })
  .strict();

export const createCoordinatorSchema = z.object({
  body: coordinatorBaseSchema,
});

export const updateCoordinatorSchema = z.object({
  body: coordinatorBaseSchema,
});

export const coordinatorIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().min(1),
  }),
});

export const assignCoordinatorSchema = z.object({
  body: z
    .object({
      program_coordinator_id: z.number().int().positive().nullable(),
    })
    .strict(),
  params: z.object({
    id: z.coerce.number().int().min(1),
  }),
});
