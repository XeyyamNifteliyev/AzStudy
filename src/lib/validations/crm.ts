// src/lib/validations/crm.ts
import { z } from "zod";
import { LEAD_PIPELINE } from "@/types/crm";

export const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(LEAD_PIPELINE as [string, ...string[]]),
});

export const assignConsultantSchema = z.object({
  leadId: z.string().uuid(),
  consultantId: z.string().uuid().nullable(),
});

export const createApplicationSchema = z.object({
  leadId: z.string().uuid(),
  universityId: z.string().min(1),
  programId: z.string().min(1).optional(),
});

export const sendMessageSchema = z.object({
  leadId: z.string().uuid(),
  body: z.string().min(1, 'Message cannot be empty').max(5000),
});

export const devLoginSchema = z.object({
  profileId: z.string().uuid(),
});

export const updateRoleSchema = z.object({
  profileId: z.string().uuid(),
  role: z.enum(["admin", "consultant"]),
});

export const allowlistEmailSchema = z.object({
  email: z
    .string()
    .email()
    .transform((e) => e.trim().toLowerCase()),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
