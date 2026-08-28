import { describe, it, expect } from 'vitest';
import { cn, slugify, formatCurrency, formatNumber } from '@/lib/utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('resolves tailwind conflicts (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });

  it('collapses repeated separators', () => {
    expect(slugify('  A   B  ')).toBe('a-b');
  });
});

describe('formatCurrency', () => {
  it('formats USD with no decimals', () => {
    expect(formatCurrency(8000, 'USD', 'en')).toMatch(/8,000/);
  });

  it('falls back gracefully for unknown currency', () => {
    expect(formatCurrency(1000, 'XYZ', 'en')).toContain('XYZ');
  });
});

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(30000, 'en')).toBe('30,000');
  });
});
