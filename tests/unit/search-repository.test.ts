import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { data } from '@/lib/data';

let pool: Pool;

beforeEach(() => {
  pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 3 });
});

afterEach(async () => {
  await pool.end();
});

describe('SearchRepository', () => {
  it('returns universities for a tsvector match', async () => {
    const res = await data.search.search('baku', 6);
    expect(res.length).toBeGreaterThan(0);
    const bakuUni = res.find((r) => r.type === 'university' && r.slug.includes('baku'));
    expect(bakuUni).toBeDefined();
  });

  it('matches programs by slug substring', async () => {
    const res = await data.search.search('medicine', 6);
    expect(res.some((r) => r.type === 'program' && r.slug.includes('med'))).toBe(true);
  });

  it('returns cities for city slug search', async () => {
    const res = await data.search.search('baku', 50);
    expect(res.some((r) => r.type === 'city' && r.slug === 'baku')).toBe(true);
  });

  it('returns an empty array for empty queries', async () => {
    expect(await data.search.search('', 6)).toEqual([]);
  });

  it('respects the limit', async () => {
    const res = await data.search.search('a', 2);
    expect(res.length).toBeLessThanOrEqual(2);
  });
});
