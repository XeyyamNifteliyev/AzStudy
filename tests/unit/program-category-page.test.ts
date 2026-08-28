import { describe, it, expect } from 'vitest';
import { data } from '@/lib/data';
import { annualTotalCost } from '@/lib/programs/costs';

describe('ProgramCategory page data flow', () => {
  it('getByCategory("architecture") returns programs with cities and universities', async () => {
    const result = await data.programs.getByCategory('architecture');
    expect(result.category?.slug).toBe('architecture');
    expect(result.programs.length).toBeGreaterThan(0);
    // Every program has a city with living cost, and a university.
    for (const p of result.programs) {
      expect(p.university).toBeDefined();
      expect(p.city).toBeDefined();
      expect(p.city.monthlyLivingCostUSD).toBeGreaterThan(0);
      expect(typeof p.tuitionFee).toBe('number');
    }
    expect(result.universityCount).toBeGreaterThan(0);
  });

  it('computes annual total cost for architecture programs (tuition + 12x living)', async () => {
    const result = await data.programs.getByCategory('architecture');
    const p = result.programs[0];
    const city = await data.cities.getByUniversityId(p.university.id);
    expect(city?.monthlyLivingCostUSD).toBeGreaterThan(0);
    const annual = annualTotalCost(p.tuitionFee, city!.monthlyLivingCostUSD);
    expect(annual).toBe(p.tuitionFee + (city!.monthlyLivingCostUSD! * 12));
  });
});
