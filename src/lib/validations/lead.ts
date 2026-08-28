import { z } from 'zod';

export const leadSchema = z.object({
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  email: z.string().email().max(120),
  phone: z
    .string()
      .min(7)
      .max(25)
      .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  whatsapp: z
    .string()
    .max(25)
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  country: z.string().min(2),
  programInterest: z.string().max(120).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
  // Primary university reference. `universitySlug` is retained for backwards
  // compatibility with older clients/form posts.
  universityId: z.string().min(1),
  universitySlug: z.string().max(120).optional().or(z.literal('')),
  programId: z.string().optional().or(z.literal('')),
  degreeLevel: z
    .enum(['bachelor', 'master', 'associate', 'phd'])
    .optional()
    .or(z.literal('')),
  instructionLanguage: z
    .enum(['english', 'azerbaijani', 'russian', 'turkish'])
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z
    .enum(['male', 'female', 'other', 'prefer-not'])
    .optional()
    .or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  passportUrl: z.string().optional().or(z.literal('')),
  diplomaUrl: z.string().optional().or(z.literal('')),
  photoUrl: z.string().optional().or(z.literal('')),
  motivationLetterUrl: z.string().optional().or(z.literal('')),
  scholarshipInterest: z.boolean().optional().default(false),
  dormitory: z.boolean().optional().default(false),
  intake: z.enum(['fall', 'spring']).optional().or(z.literal('')),
  locale: z.string().min(2),
  // Honeypot — must stay empty
  website: z.string().max(0).optional().or(z.literal('')),
});

export type LeadInput = z.infer<typeof leadSchema>;
