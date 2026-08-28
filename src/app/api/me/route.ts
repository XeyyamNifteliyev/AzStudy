import { NextResponse } from "next/server";
import { getStudentSessionForLayoutReadOnly } from "@/lib/student-session-server";
import { rateLimit, getIpFromHeaders } from "@/lib/rate-limit";
import { headers } from "next/headers";

// M5: Rate limit /api/me to prevent abuse (30/min per IP).
const meLimiter = rateLimit({ windowMs: 60_000, max: 30 });

// Resolves the current student session for client-side consumption (header
// avatar / sign-in state). Kept as a route handler so the marketing PAGES stay
// statically renderable (ISR) — the per-request cookie read happens here, not
// in the page/layout render tree.
// PERF(B): read-only — uses getProfileByAuthUid (no DB write). Linking still
// happens via requireStudent on /dashboard.
export const dynamic = "force-dynamic";

export async function GET() {
  // M5: Rate check before any DB/auth work.
  const h = await headers();
  const ip = getIpFromHeaders((name) => h.get(name));
  if (!(await meLimiter.check(ip))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const session = await getStudentSessionForLayoutReadOnly();
  const res = session ?? { profile: null };
  return NextResponse.json(res, {
    headers: { "cache-control": "no-store" },
  });
}
