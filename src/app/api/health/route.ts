import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint for uptime monitors / orchestrators.
 * Runs `select 1` against Postgres (with a short timeout) so a dead DB actually
 * fails the check — `ok:true` must mean the app can serve requests.
 *
 * Uses the shared app pool instead of creating a per-request Pool (connection
 * churn under frequent uptime probes).
 */
export async function GET() {
  let dbOk = false;
  if (process.env.DATABASE_URL || process.env.APP_DATABASE_URL) {
    try {
      const pool = getPool();
      await Promise.race([
        pool.query("select 1"),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("health query timeout")), 2500),
        ),
      ]);
      dbOk = true;
    } catch (err) {
      dbOk = false;
      // QA-1: surface DB-outage as a structured error so an uptime monitor +
      // log drain can page on it (no PII, no connection-string leak).
      logger.error("health check failed: DB unreachable", undefined, err);
    }
  }
  // L2: don't leak DB presence to the public — return only ok/status.
  if (!dbOk) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
