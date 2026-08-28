import { z } from 'zod';

export const sendMessageSchema = z.object({
  leadId: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

export const devStudentLoginSchema = z.object({
  profileId: z.string().uuid(),
  locale: z.string().min(2),
});
