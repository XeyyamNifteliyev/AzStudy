import { describe, it, expect } from 'vitest';
import {
  signSessionPayload,
  verifySessionPayload,
} from '../../src/lib/crm/cookie-signature';

describe('cookie signature (HMAC)', () => {
  it('round-trips a payload', () => {
    const signed = signSessionPayload({ userId: 'abc', role: 'admin' });
    const parsed = verifySessionPayload<{ userId: string; role: string }>(signed);
    expect(parsed).toEqual({ userId: 'abc', role: 'admin' });
  });

  it('rejects an unsigned JSON payload', () => {
    const forged = Buffer.from(JSON.stringify({ userId: 'admin' })).toString('base64url');
    expect(verifySessionPayload(forged)).toBeNull();
  });

  it('rejects a tampered payload', () => {
    const signed = signSessionPayload({ userId: 'abc', role: 'admin' });
    // Flip the userId to an admin id without re-signing.
    const [body, sig] = signed.split('.');
    const tampered = Buffer.from(JSON.stringify({ userId: '11111111-1111-1111-1111-111111111111', role: 'admin' })).toString('base64url');
    expect(verifySessionPayload(`${tampered}.${sig}`)).toBeNull();
    void body;
  });

  it('rejects garbage input', () => {
    expect(verifySessionPayload('not-a-cookie')).toBeNull();
    expect(verifySessionPayload(undefined)).toBeNull();
    expect(verifySessionPayload('')).toBeNull();
  });
});
