import { describe, it, expect } from 'vitest';
import { leadSchema } from '@/lib/validations/lead';

const base = {
  firstName: 'Ali',
  lastName: 'Valiyev',
  email: 'ali@example.com',
  phone: '+994501234567',
  country: 'AZ',
  universityId: 'u-bahcesehir',
  locale: 'az',
};

describe('leadSchema', () => {
  it('accepts a valid lead', () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it('rejects an empty honeypot field (website must be empty)', () => {
    const r = leadSchema.safeParse({ ...base, website: 'spam' });
    expect(r.success).toBe(false);
  });

  it('accepts an empty honeypot field', () => {
    const r = leadSchema.safeParse({ ...base, website: '' });
    expect(r.success).toBe(true);
  });

  it('rejects invalid phone characters', () => {
    const r = leadSchema.safeParse({ ...base, phone: 'abc123' });
    expect(r.success).toBe(false);
  });

  it('accepts formatted phone numbers', () => {
    const r = leadSchema.safeParse({ ...base, phone: '+1 (555) 123-4567' });
    expect(r.success).toBe(true);
  });

  it('accepts optional fields as empty strings', () => {
    const r = leadSchema.safeParse({
      ...base,
      programId: '',
      degreeLevel: '',
      gender: '',
      intake: '',
    });
    expect(r.success).toBe(true);
  });

  it('rejects an invalid degreeLevel enum', () => {
    const r = leadSchema.safeParse({ ...base, degreeLevel: 'doctor' });
    expect(r.success).toBe(false);
  });

  it('rejects an invalid instructionLanguage enum', () => {
    const r = leadSchema.safeParse({ ...base, instructionLanguage: 'german' });
    expect(r.success).toBe(false);
  });

  it('defaults scholarshipInterest and dormitory to false', () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.scholarshipInterest).toBe(false);
      expect(r.data.dormitory).toBe(false);
    }
  });
});
