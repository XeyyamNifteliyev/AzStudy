import { NextResponse } from "next/server";
import { data } from "@/lib/data";
import { rateLimit, getIpFromHeaders } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// 30 searches per minute per IP — search does ILIKE scans, so this throttles
// cheap scripted abuse while staying generous for real users.
const searchLimiter = rateLimit({ windowMs: 60_000, max: 30 });

export async function GET(req: Request) {
  const ip = getIpFromHeaders((name) => req.headers.get(name));
  if (!(await searchLimiter.check(ip))) {
    return NextResponse.json(
      { results: [], error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(req.url);
  // Cap the query length: a multi-KB `q` turns the ILIKE scan into pointless
  // CPU/DB work. Real queries are far below this bound.
  const q = (searchParams.get("q") ?? "").slice(0, 100);
  const rawLimit = Number(searchParams.get("limit") ?? 10);
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 25) : 10;

  if (!q.trim()) return NextResponse.json({ results: [] });

  try {
    const results = await data.search.search(q, limit);
    return NextResponse.json({ results });
  } catch (err) {
    logger.error("search api error", { error: String(err) });
    return NextResponse.json(
      { results: [], error: "search_failed" },
      { status: 500 },
    );
  }
}
