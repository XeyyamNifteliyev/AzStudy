import { describe, it, expect } from 'vitest';
import { isLocale, isRtl, routing } from '@/i18n/routing';

describe('isLocale', () => {
  it('accepts configured locales', () => {
    for (const l of routing.locales) {
      expect(isLocale(l)).toBe(true);
    }
  });

  it('rejects unknown codes', () => {
    expect(isLocale('xx')).toBe(false);
    expect(isLocale('')).toBe(false);
  });
});

describe('isRtl', () => {
  const RTL = new Set(['ar', 'fa', 'ur']);
  it('flags Arabic, Persian and Urdu as RTL', () => {
    expect(isRtl('ar')).toBe(true);
    expect(isRtl('fa')).toBe(true);
    expect(isRtl('ur')).toBe(true);
  });

  it('classifies every configured locale correctly', () => {
    for (const l of routing.locales) {
      expect(isRtl(l)).toBe(RTL.has(l));
    }
  });
});
