import { z } from 'zod';

const programBaseSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(150, {
      message: 'Name must be at most 150 characters',
    }),
    level: z.enum(['undergraduate', 'postgraduate'], {
      message: 'Level must be undergraduate or postgraduate',
    }),
    duration_years: z
      .number({ invalid_type_error: 'Duration years must be a number' })
      .int({ message: 'Duration years must be an integer' })
      .min(1, { message: 'Duration years must be at least 1' })
      .max(8, { message: 'Duration years must be at most 8' }),
    short_description: z
      .string()
      .min(10, { message: 'Short description must be at least 10 characters' })
      .max(255, { message: 'Short description must be at most 255 characters' }),
    about_text: z.string().min(10, { message: 'About text must be at least 10 characters' }),
    entry_requirements_text: z
      .string()
      .min(5, { message: 'Entry requirements must be at least 5 characters' }),
    scholarships_text: z
      .string()
      .min(0, { message: 'Scholarships text must be at least 0 characters' }),
  })
  .strict();

export const createProgramSchema = z.object({
  body: programBaseSchema,
});

export const updateProgramSchema = z.object({
  body: programBaseSchema,
});

export const listProgramsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
      level: z.enum(['undergraduate', 'postgraduate']).optional(),
      search: z.string().min(1).max(150).optional(),
    })
    .strict(),
});

export const programIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().min(1),
  }),
});
