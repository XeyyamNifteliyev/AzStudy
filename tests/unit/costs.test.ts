import { describe, it, expect } from 'vitest';
import { annualTotalCost } from '@/lib/programs/costs';

describe('annualTotalCost', () => {
  it('adds tuition to 12x monthly living cost', () => {
    expect(annualTotalCost(7000, 500)).toBe(13000);
  });

  it('returns tuition only when living cost is missing', () => {
    expect(annualTotalCost(7000, undefined)).toBe(7000);
  });

  it('adds 12x monthly cost even when tuition is zero', () => {
    expect(annualTotalCost(0, 500)).toBe(6000);
  });
});
