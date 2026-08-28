// src/lib/crm/cookie-signature.ts
// HMAC-SHA256 signing for the dev-auth cookies (admin_session / student_session).
//
// The dev-auth payload is a plain JSON blob ({ userId, role, fullName }). Without
// a signature anyone who can set a cookie (XSS, sibling subdomain, dev tooling)
// could forge an admin identity. We sign the payload with a server-side secret:
//   cookie value = `${base64(payload)}.${base64(hmac(base64(payload)))}`
// Every read verifies the signature before trusting the userId.
import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_SECRET = process.env.SESSION_SECRET ?? (process.env.NODE_ENV === 'production' ? (() => { throw new Error('SESSION_SECRET is required in production'); })() : 'dev-insecure-session-secret');

function hmac(input: string): string {
  return createHmac('sha256', SESSION_SECRET).update(input).digest('base64url');
}

/** Sign an arbitrary object into a `payload.signature` cookie value. */
export function signSessionPayload(payload: Record<string, unknown>): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body)}`;
}

/** Verify a signed cookie value; returns the parsed payload or null. */
export function verifySessionPayload<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot <= 0) return null;
  const body = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = Buffer.from(hmac(body));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}
