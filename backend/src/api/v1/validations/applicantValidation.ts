import { z } from 'zod';

const nameField = z.string().trim().min(2).max(80);
const longNameField = z.string().trim().min(2).max(150);
const shortField = z.string().trim().min(2).max(120);

export const applicantProfileSchema = z
  .object({
    first_name: nameField,
    last_name: nameField,
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date of birth must be YYYY-MM-DD',
    }),
    gender: z.string().trim().min(2).max(20),
    passport_no: z.string().trim().min(3).max(30),
    id_no: z.string().trim().min(3).max(30),
    place_of_birth: z.string().trim().min(2).max(120),
    contact_number: z.string().trim().min(5).max(30),
    email_address: z.string().trim().email().optional(),
    application_owner: z.string().trim().min(2).max(120).optional(),
    country: z.string().trim().min(2).max(80),
    address_line: z.string().trim().min(2).max(150),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    zip_postcode: z.string().trim().min(2).max(20),
    mother_full_name: longNameField,
    father_full_name: longNameField,
    heard_about_university: shortField,
  })
  .strict();

export const updateApplicantProfileSchema = z.object({
  body: applicantProfileSchema,
});
