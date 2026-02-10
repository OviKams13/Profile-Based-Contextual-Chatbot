import { z } from 'zod';

const statusEnum = z.enum(['submitted', 'accepted', 'rejected']);
const sortEnum = z.enum(['created_at_desc', 'created_at_asc']);

// Dean inbox accepts only explicit filters to avoid unexpected query behavior.
export const adminApplicationListSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
      status: statusEnum.optional(),
      program_id: z.coerce.number().int().positive().optional(),
      search: z.string().trim().min(1).optional(),
      sort: sortEnum.optional(),
    })
    .strict(),
});

export const adminApplicationParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int().positive(),
    })
    .strict(),
});
