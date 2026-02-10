import { z } from 'zod';
import { applicantProfileSchema } from './applicantValidation';

export const submitApplicationSchema = z.object({
  body: z
    .object({
      program_id: z.number().int().positive(),
      profile: applicantProfileSchema,
    })
    .strict(),
});

export const listApplicationsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
    })
    .strict(),
});
