// src/lib/db.ts — single shared pg.Pool for the whole app.
// BE-1: both the CRM and the marketing data layer previously created their own
// pools (max 2 + max 5) against the same DATABASE_URL — up to ~7 connections
// per serverless instance. One pool with a sane default avoids exhausting
// Supabase `max_connections`.
import { Pool } from "pg";

let pool: Pool | null = null;

function defaultPoolMax(): number {
  return process.env.npm_lifecycle_event === "build" ||
    process.env.NEXT_PHASE === "phase-production-build"
    ? 1
    : 2;
}

export function getPool(): Pool {
  if (!pool) {
    // SEC: prefer the least-privilege runtime role. APP_DATABASE_URL is a
    // connection string for the `app_user` role created by migration 0026
    // (DML-only, no DDL). DATABASE_URL remains the owner/migration URL.
    // `||` (not `??`): an empty-string env value (e.g. "APP_DATABASE_URL="
    // left in .env.local) must fall through to DATABASE_URL, not win.
    const url = process.env.APP_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    const max = Number(process.env.PGPOOL_MAX ?? defaultPoolMax());
    pool = new Pool({ connectionString: url, max });
    // Prevent unhandled EventEmitter errors from crashing the process when an
    // idle client hits a connection error.
    pool.on("error", (err) => {
      console.error("[pg pool error]", err);
    });
  }
  return pool;
}
